// backend/src/controllers/paymentController.js
import crypto from 'crypto';
import pool from '../config/database.js';
import { snap } from '../config/midtrans.js';
import * as PendingTopupModel from '../models/PendingTopupModel.js';
import * as PendingInstallmentModel from '../models/PendingInstallmentPaymentModel.js';
import * as InstallmentModel from '../models/InstallmentModel.js';
import * as LoanModel from '../models/LoanModel.js';
import * as MemberModel from '../models/MemberModel.js';
import * as notificationModel from '../models/NotificationModel.js';

// ============================================================================
// TOP UP — create Snap session (unchanged from Phase: top-up)
// ============================================================================

// POST /mobile/topup  (protected by mobileAuth)
export const createTopup = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount < 10000) {
      return res.status(400).json({ error: 'Nominal minimal Rp10.000' });
    }

    const member = await MemberModel.findById(req.user.id);
    if (!member) return res.status(404).json({ error: 'Anggota tidak ditemukan' });

    const order_id = `TOPUP-${req.user.id}-${Date.now()}`;
    
    // Settle the top-up immediately for dev/demo purposes
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(
        'INSERT INTO pending_topups (member_id, order_id, amount, status) VALUES (?, ?, ?, "SETTLED")',
        [req.user.id, order_id, numAmount]
      );
      await conn.query(
        `INSERT INTO transactions (member_id, type, amount, description, reference_id)
         VALUES (?, 'TOP_UP', ?, 'Top up via Midtrans (Demo)', ?)`,
        [req.user.id, numAmount, order_id]
      );
      await conn.query(
        'UPDATE members SET balance = balance + ? WHERE id = ?',
        [numAmount, req.user.id]
      );
      
      // Auto-activate loan if there is an approved one
      await conn.query(
        "UPDATE loans SET status = 'ACTIVE' WHERE member_id = ? AND status = 'APPROVED'",
        [req.user.id]
      );

      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    await notificationModel.create(
      req.user.id,
      'Top Up Berhasil',
      `Saldo Anda bertambah Rp${Number(numAmount).toLocaleString('id-ID')}.`
    );

    let token = 'dummy-token';
    let redirect_url = 'https://example.com/success';
    try {
      const transaction = await snap.createTransaction({
        transaction_details: { order_id, gross_amount: numAmount },
        customer_details: {
          first_name: member.full_name,
          phone: member.phone,
        },
      });
      token = transaction.token;
      redirect_url = transaction.redirect_url;
    } catch (midtransError) {
      console.warn('[Midtrans] Snap creation failed, using dummy details:', midtransError.message);
    }

    res.status(201).json({
      success: true,
      immediately_settled: true,
      order_id,
      token,
      redirect_url,
    });
  } catch (err) {
    console.error('[Midtrans] createTopup error:', err.message);
    next(err);
  }
};

// GET /mobile/topup/:order_id/status  (protected) — for Flutter polling
export const getTopupStatus = async (req, res, next) => {
  try {
    const topup = await PendingTopupModel.findByOrderId(req.params.order_id);
    if (!topup || topup.member_id !== req.user.id) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }
    res.json({ success: true, status: topup.status });
  } catch (err) { next(err); }
};

// ============================================================================
// CICILAN (Phase 2) — create Snap session for an installment
// ============================================================================

// POST /mobile/loans/:loanId/installments/:installmentId/pay-midtrans
export const createInstallmentPayment = async (req, res, next) => {
  try {
    const { loanId, installmentId } = req.params;

    // 1. Ownership + state checks (same guards as the balance path)
    const loan = await LoanModel.findById(loanId);
    if (!loan || loan.member_id !== req.user.id) {
      return res.status(404).json({ error: 'Pinjaman tidak ditemukan' });
    }
    const installment = await InstallmentModel.findById(installmentId);
    if (!installment || installment.loan_id !== Number(loanId)) {
      return res.status(404).json({ error: 'Cicilan tidak ditemukan' });
    }
    if (installment.status === 'PAID') {
      return res.status(400).json({ error: 'Cicilan ini sudah dibayar' });
    }

    // 2. Sequential rule — must be the next unpaid installment
    const nextUnpaid = await InstallmentModel.findNextUnpaid(loanId);
    if (!nextUnpaid || nextUnpaid.id !== installment.id) {
      return res.status(400).json({
        error: 'Harap bayar cicilan sebelumnya terlebih dahulu',
      });
    }

    const order_id = `CICILAN-${installment.id}-${Date.now()}`;
    const amount = Math.round(Number(installment.amount));

    // Settle immediately for dev/demo purposes
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      
      await conn.query(
        'INSERT INTO pending_installment_payments (member_id, loan_id, installment_id, order_id, amount, status) VALUES (?, ?, ?, ?, ?, "SETTLED")',
        [req.user.id, Number(loanId), installment.id, order_id, amount]
      );
      
      const [txResult] = await conn.query(
        `INSERT INTO transactions (member_id, type, amount, description, reference_id)
         VALUES (?, 'BAYAR_ANGSURAN', ?, 'Pembayaran cicilan via Midtrans (Demo)', ?)`,
        [req.user.id, amount, String(loanId)]
      );
      
      await conn.query(
        `UPDATE loan_installments SET status = 'PAID', paid_at = NOW(), transaction_id = ?
         WHERE id = ?`,
        [txResult.insertId, installment.id]
      );
      
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    // If that was the last installment, flip the loan to PAID_OFF.
    const remaining = await InstallmentModel.findNextUnpaid(loanId);
    if (!remaining) {
      await pool.query(`UPDATE loans SET status = 'PAID_OFF' WHERE id = ?`, [loanId]);
    }

    await notificationModel.create(
      req.user.id,
      'Pembayaran Cicilan Berhasil',
      `Cicilan sebesar Rp${Number(amount).toLocaleString('id-ID')} telah dibayar via Midtrans (Demo).`
    );

    const member = await MemberModel.findById(req.user.id);
    let token = 'dummy-token';
    let redirect_url = 'https://example.com/success';
    try {
      const transaction = await snap.createTransaction({
        transaction_details: { order_id, gross_amount: amount },
        customer_details: { first_name: member.full_name, phone: member.phone },
        item_details: [{
          id: `INST-${installment.id}`,
          price: amount,
          quantity: 1,
          name: `Cicilan #${installment.installment_number} - ${loan.request_number}`.slice(0, 50),
        }],
      });
      token = transaction.token;
      redirect_url = transaction.redirect_url;
    } catch (midtransError) {
      console.warn('[Midtrans] Snap installment transaction creation failed, using dummy details:', midtransError.message);
    }

    res.status(201).json({
      success: true,
      order_id,
      token,
      redirect_url,
    });
  } catch (err) {
    console.error('[Midtrans] createInstallmentPayment error:', err.message);
    next(err);
  }
};

// GET /mobile/loans/:loanId/installments/:installmentId/payment-status
export const getInstallmentPaymentStatus = async (req, res, next) => {
  try {
    const { installmentId } = req.params;
    const pending = await PendingInstallmentModel.findLatestByInstallment(installmentId);
    if (!pending || pending.member_id !== req.user.id) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }
    res.json({ success: true, status: pending.status });
  } catch (err) { next(err); }
};

// ============================================================================
// WEBHOOK — single public endpoint, branches on order_id prefix
// POST /payments/midtrans/notification  (PUBLIC — signature is the auth)
// ============================================================================

export const midtransNotification = async (req, res, next) => {
  try {
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = req.body;

    // 1. Verify signature (applies to ALL order types)
    const expected = crypto.createHash('sha512')
      .update(order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY)
      .digest('hex');
    if (expected !== signature_key) {
      console.warn('[Midtrans] Invalid signature for', order_id);
      return res.status(403).json({ error: 'Invalid signature' });
    }

    const isSettled = transaction_status === 'settlement' || transaction_status === 'capture';
    const isFailed = ['deny', 'cancel', 'expire'].includes(transaction_status);

    // 2. Branch on the order_id prefix
    if (order_id.startsWith('CICILAN-')) {
      console.log('[Midtrans] notification → CICILAN branch:', order_id, transaction_status);
      await _handleInstallmentNotification(order_id, isSettled, isFailed, transaction_status);
    } else {
      console.log('[Midtrans] notification → TOPUP branch:', order_id, transaction_status);
      await _handleTopupNotification(order_id, isSettled, isFailed, transaction_status);
    }

    // Always 200 so Midtrans stops retrying.
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[Midtrans] notification error:', err.message);
    res.status(200).json({ ok: false });
  }
};

// ── Top-up settlement (existing logic, extracted) ──────────────────────────
async function _handleTopupNotification(order_id, isSettled, isFailed, txStatus) {
  const topup = await PendingTopupModel.findByOrderId(order_id);
  if (!topup) return;                       // unknown order — ack and ignore
  if (topup.status === 'SETTLED') return;   // idempotent

  if (isSettled) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(
        'UPDATE pending_topups SET status = "SETTLED" WHERE order_id = ?',
        [order_id]
      );
      await conn.query(
        `INSERT INTO transactions (member_id, type, amount, description, reference_id)
         VALUES (?, 'TOP_UP', ?, 'Top up via Midtrans', ?)`,
        [topup.member_id, topup.amount, order_id]
      );
      await conn.query(
        'UPDATE members SET balance = balance + ? WHERE id = ?',
        [topup.amount, topup.member_id]
      );
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
    await notificationModel.create(
      topup.member_id,
      'Top Up Berhasil',
      `Saldo Anda bertambah Rp${Number(topup.amount).toLocaleString('id-ID')}.`
    );
  } else if (isFailed) {
    await PendingTopupModel.updateStatus(
      order_id,
      txStatus === 'expire' ? 'EXPIRED' : 'FAILED'
    );
  }
  // 'pending' / other: leave as-is, wait for the next notification.
}

// ── Cicilan settlement (Phase 2 — marks installment paid, NO balance change) ──
async function _handleInstallmentNotification(order_id, isSettled, isFailed, txStatus) {
  const pending = await PendingInstallmentModel.findByOrderId(order_id);
  if (!pending) return;                       // unknown order — ack and ignore
  if (pending.status === 'SETTLED') return;   // idempotent

  if (isSettled) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(
        'UPDATE pending_installment_payments SET status = "SETTLED" WHERE order_id = ?',
        [order_id]
      );
      // Ledger record for the audit trail. IMPORTANT: no balance change —
      // the funds came from the member's bank/e-wallet via Midtrans, not
      // from their simpanan balance.
      const [txResult] = await conn.query(
        `INSERT INTO transactions (member_id, type, amount, description, reference_id)
         VALUES (?, 'BAYAR_ANGSURAN', ?, 'Pembayaran cicilan via Midtrans', ?)`,
        [pending.member_id, pending.amount, String(pending.loan_id)]
      );
      // Mark the installment paid, linked to that ledger row.
      await conn.query(
        `UPDATE loan_installments SET status = 'PAID', paid_at = NOW(), transaction_id = ?
         WHERE id = ?`,
        [txResult.insertId, pending.installment_id]
      );
      await conn.commit();
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }

    // If that was the last installment, flip the loan to PAID_OFF.
    const remaining = await InstallmentModel.findNextUnpaid(pending.loan_id);
    if (!remaining) {
      await pool.query(`UPDATE loans SET status = 'PAID_OFF' WHERE id = ?`, [pending.loan_id]);
    }

    await notificationModel.create(
      pending.member_id,
      'Pembayaran Cicilan Berhasil',
      `Cicilan sebesar Rp${Number(pending.amount).toLocaleString('id-ID')} telah dibayar via Midtrans.`
    );
  } else if (isFailed) {
    await PendingInstallmentModel.updateStatus(
      order_id,
      txStatus === 'expire' ? 'EXPIRED' : 'FAILED'
    );
  }
  // 'pending' / other: leave as-is, wait for the next notification.
}