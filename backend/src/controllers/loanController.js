// backend/src/controllers/loanController.js
import * as loanService from '../services/loanService.js';
import * as loanModel from '../models/LoanModel.js';
import * as MemberModel from '../models/MemberModel.js';
import { scoreLoanApplication } from '../services/loanMlScoringService.js';
import * as notificationModel from '../models/NotificationModel.js';

export const getLoans = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || 'PENDING';
    const { data, total } = await loanService.getAllLoans(page, limit, status);
    res.json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (err) {
    next(err);
  }
};

export const getLoanDetail = async (req, res, next) => {
  try {
    const loan = await loanModel.findById(req.params.id); // ✅ perbaiki huruf kecil
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    res.json({ success: true, data: loan });
  } catch (err) { next(err); }
};

// export const approveLoan = async (req, res, next) => {
//   try {
//     const { approvedAmount, approvedTenor } = req.body;
//     if (!approvedAmount || approvedAmount <= 0) throw new Error('Jumlah yang disetujui harus diisi');
//     if (!approvedTenor || approvedTenor <= 0) throw new Error('Tenor harus diisi');
//     const reviewerId = req.user?.id || 1;
//     await loanService.approveLoan(req.params.id, reviewerId, approvedAmount, approvedTenor);
//     res.json({ success: true, message: 'Pinjaman disetujui' });
//   } catch (err) {
//     next(err);
//   }
// };

// export const rejectLoan = async (req, res, next) => {
//   try {
//     const { reason } = req.body;
//     if (!reason) throw new Error('Alasan penolakan harus diisi');
//     const reviewerId = req.user?.id || 1;
//     await loanService.rejectLoan(req.params.id, reviewerId, reason);
//     res.json({ success: true, message: 'Pinjaman ditolak' });
//   } catch (err) {
//     next(err);
//   }
// };

export const approveLoan = async (req, res, next) => {
    try {
        const { approvedAmount, approvedTenor } = req.body;
        const reviewerId = req.user?.id || 1;
        const loan = await loanModel.findById(req.params.id);
        await loanService.approveLoan(req.params.id, reviewerId, approvedAmount, approvedTenor);
        await notificationModel.create(loan.member_id, 'Pinjaman Disetujui', `Pinjaman Anda sebesar Rp${approvedAmount.toLocaleString()} telah disetujui.`);
        res.json({ success: true, message: 'Pinjaman disetujui' });
    } catch (err) { next(err); }
};

export const rejectLoan = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const reviewerId = req.user?.id || 1;
        const loan = await loanModel.findById(req.params.id);
        await loanService.rejectLoan(req.params.id, reviewerId, reason);
        await notificationModel.create(loan.member_id, 'Pinjaman Ditolak', `Pengajuan pinjaman ditolak. Alasan: ${reason}`);
        res.json({ success: true, message: 'Pinjaman ditolak' });
    } catch (err) { next(err); }
};

export const createLoan = async (req, res, next) => {
    let loanId;
    try {
        let { member_id, amount, tenor, purpose, type } = req.body;

        // ── Validasi member_id ───────────────────────────────────────
        if (!member_id || isNaN(parseInt(member_id, 10))) {
            return next(new Error('member_id tidak valid'));
        }

        // ── Sanitasi & validasi amount ─────────────────────────────
        const rawAmount = String(amount ?? '').replace(/[^0-9]/g, '');
        const numAmount = parseInt(rawAmount, 10);
        if (!rawAmount || isNaN(numAmount) || numAmount <= 0) {
            return next(new Error('Jumlah pembiayaan tidak valid.'));
        }
        if (numAmount < 100000) {
            return next(new Error('Jumlah pembiayaan minimal Rp 100.000.'));
        }
        if (numAmount > 500000000) {
            return next(new Error('Jumlah pembiayaan maksimal Rp 500.000.000.'));
        }
        amount = numAmount;

        // ── Sanitasi tenor ────────────────────────────────────────────
        const numTenor = parseInt(tenor, 10);
        if (isNaN(numTenor) || numTenor <= 0) {
            return next(new Error('Tenor tidak valid.'));
        }
        tenor = numTenor;

        // ── Sanitasi purpose ─────────────────────────────────────────
        purpose = String(purpose ?? '').trim();
        if (!purpose || purpose.length < 3) {
            return next(new Error('Tujuan pembiayaan harus diisi (min. 3 karakter).'));
        }
        if (purpose.length > 255) {
            return next(new Error('Tujuan pembiayaan terlalu panjang.'));
        }

        // ── Sanitasi type ─────────────────────────────────────────────
        const validTypes = ['MURABAHAH', 'QARDHUL_HASAN'];
        type = String(type ?? '').trim().toUpperCase();
        if (!validTypes.includes(type)) {
            return next(new Error('Jenis produk pembiayaan tidak valid.'));
        }

        const request_number = `K${Date.now()}`;
        loanId = await loanModel.create({ member_id, request_number, amount, tenor, purpose, type, status: 'PENDING' });
        
        // Panggil AI secara synchronous (await) agar hasil langsung tersimpan
        const { recommendation, prob_default, ai_score, risk_level } = await scoreLoanApplication(member_id, { amount, tenor, purpose });
        
        const max_approved_amount = prob_default ? amount * (1 - prob_default) : amount * 0.8;
        await loanModel.updateAIResult(loanId, {
            ai_score,
            ai_recommendation: recommendation,
            prob_default,
            risk_level,
            max_approved_amount,
        });
        const formattedAmount = `Rp${Number(amount).toLocaleString('id-ID')}`;
        await notificationModel.create(member_id, 'Analisis AI Selesai', `Pengajuan pinjaman ${formattedAmount} telah dianalisis. Skor kelayakan: ${ai_score} (${recommendation})`);
        console.log(`[AI] Loan ${loanId} updated with ML result.`);
        
        res.status(201).json({ success: true, loanId });
    } catch (err) { 
        console.error('[AI] Error in createLoan:', err.message);
        // Tetap return success meskipun AI gagal, agar pinjaman tetap tercatat
        res.status(201).json({ success: true, loanId, ai_warning: 'AI scoring failed' });
    }
};
