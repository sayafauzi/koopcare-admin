import * as transactionModel from '../models/TransactionModel.js';
import pool from '../config/database.js';

export const recordTransaction = async (transactionData) => {
  const { member_id, type, amount, description, reference_id, cashier_id } = transactionData;
  
  console.log('=== TRANSACTION DEBUG ===');
  console.log('Received type:', type);
  console.log('Amount:', amount);
  console.log('Member ID:', member_id);

  if (amount <= 0) throw new Error('Nominal harus lebih dari 0');

  // Definisikan tipe dengan eksplisit
  const CREDIT_TYPES = ['SETORAN_WAJIB', 'TOP_UP'];
  const DEBIT_TYPES = ['TARIK_TUNAI', 'BAYAR_ANGSURAN', 'PENARIKAN_SALDO', 'TRANSFER'];

  const isCredit = CREDIT_TYPES.includes(type);
  const isDebit = DEBIT_TYPES.includes(type);

  console.log('isCredit:', isCredit);
  console.log('isDebit:', isDebit);

  if (!isCredit && !isDebit) {
    throw new Error(`Jenis transaksi tidak dikenal: ${type}`);
  }

  // Hanya cek saldo jika debit
  if (isDebit) {
    const [rows] = await pool.query('SELECT balance FROM members WHERE id = ?', [member_id]);
    const currentBalance = rows[0]?.balance ?? 0;
    console.log('Current balance:', currentBalance);
    if (currentBalance < amount) {
      throw new Error('Saldo tidak mencukupi');
    }
  } else {
    console.log('Transaksi kredit, tidak perlu cek saldo');
  }

  // Simpan transaksi
  const transactionId = await transactionModel.create({
    member_id, type, amount, description, reference_id, cashier_id
  });

  // Jika transaksi adalah BAYAR_ANGSURAN dan diproses oleh kasir (tanpa reference_id awal)
  if (type === 'BAYAR_ANGSURAN' && !reference_id) {
    try {
      const [loans] = await pool.query(
        "SELECT id FROM loans WHERE member_id = ? AND status IN ('APPROVED', 'ACTIVE') ORDER BY created_at DESC LIMIT 1",
        [member_id]
      );
      if (loans.length > 0) {
        const loanId = loans[0].id;
        let remainingAmount = Number(amount);
        
        // Loop to mark installments as paid as long as we have amount left
        while (remainingAmount > 0) {
          const [installments] = await pool.query(
            "SELECT id, amount FROM loan_installments WHERE loan_id = ? AND status = 'PENDING' ORDER BY installment_number ASC LIMIT 1",
            [loanId]
          );
          if (installments.length === 0) break;
          
          const inst = installments[0];
          const instAmount = Number(inst.amount);
          
          // If we have enough remaining amount to cover at least a significant portion of the installment
          if (remainingAmount >= instAmount - 10) { // small tolerance for rounding
            await pool.query(
              "UPDATE loan_installments SET status = 'PAID', paid_at = NOW(), transaction_id = ? WHERE id = ?",
              [transactionId, inst.id]
            );
            remainingAmount -= instAmount;
          } else {
            // Not enough to pay the next installment fully, stop
            break;
          }
        }
        
        // Link transaction to the loan
        await pool.query(
          "UPDATE transactions SET reference_id = ? WHERE id = ?",
          [String(loanId), transactionId]
        );

        // Check if loan is fully paid off
        const [remaining] = await pool.query(
          "SELECT COUNT(*) as count FROM loan_installments WHERE loan_id = ? AND status = 'PENDING'",
          [loanId]
        );
        if (remaining[0].count === 0) {
          await pool.query("UPDATE loans SET status = 'PAID_OFF' WHERE id = ?", [loanId]);
        }
      }
    } catch (err) {
      console.error('[Cashier Installment Payment] Auto-pay failed:', err.message);
    }
  }

  // Jika transaksi adalah TOP_UP dan diproses oleh kasir, otomatis aktifkan pinjaman APPROVED jika ada
  if (type === 'TOP_UP') {
    try {
      await pool.query(
        "UPDATE loans SET status = 'ACTIVE' WHERE member_id = ? AND status = 'APPROVED'",
        [member_id]
      );
    } catch (err) {
      console.error('[Cashier Topup] Auto-activate loan failed:', err.message);
    }
  }

  // Hitung perubahan saldo
  let balanceChange = 0;
  if (isCredit) balanceChange = amount;      // tambah
  else if (isDebit) balanceChange = -amount; // kurangi

  console.log('Balance change:', balanceChange);

  // Update saldo anggota
  const [updateResult] = await pool.query(
    'UPDATE members SET balance = balance + ? WHERE id = ?',
    [balanceChange, member_id]
  );
  console.log('Rows affected:', updateResult.affectedRows);

  // Ambil saldo baru untuk verifikasi
  const [newBalance] = await pool.query('SELECT balance FROM members WHERE id = ?', [member_id]);
  console.log('New balance:', newBalance[0]?.balance);
  console.log('========================\n');

  return transactionId;
};

export const getDailyTransactions = async (cashierId = null) => {
  return await transactionModel.getTodayByCashier(cashierId);
};