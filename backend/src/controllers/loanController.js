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
    try {
        const { member_id, amount, tenor, purpose, type } = req.body;
        const request_number = `LOAN${Date.now()}`;
        const loanId = await loanModel.create({ member_id, request_number, amount, tenor, purpose, type, status: 'PENDING' });
        
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
        console.log(`[AI] Loan ${loanId} updated with ML result.`);
        
        res.status(201).json({ success: true, loanId });
    } catch (err) { 
        console.error('[AI] Error in createLoan:', err.message);
        // Tetap return success meskipun AI gagal, agar pinjaman tetap tercatat
        res.status(201).json({ success: true, loanId, ai_warning: 'AI scoring failed' });
    }
};
