// backend/src/controllers/loanController.js
import * as loanService from '../services/loanService.js';
import * as loanModel from '../models/LoanModel.js';
import * as MemberModel from '../models/MemberModel.js';
import { getAIRecommendation } from '../services/aiScoringService.js';

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

export const approveLoan = async (req, res, next) => {
  try {
    const { approvedAmount, approvedTenor } = req.body;
    if (!approvedAmount || approvedAmount <= 0) throw new Error('Jumlah yang disetujui harus diisi');
    if (!approvedTenor || approvedTenor <= 0) throw new Error('Tenor harus diisi');
    const reviewerId = req.user?.id || 1;
    await loanService.approveLoan(req.params.id, reviewerId, approvedAmount, approvedTenor);
    res.json({ success: true, message: 'Pinjaman disetujui' });
  } catch (err) {
    next(err);
  }
};

export const rejectLoan = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) throw new Error('Alasan penolakan harus diisi');
    const reviewerId = req.user?.id || 1;
    await loanService.rejectLoan(req.params.id, reviewerId, reason);
    res.json({ success: true, message: 'Pinjaman ditolak' });
  } catch (err) {
    next(err);
  }
};

export const createLoan = async (req, res, next) => {
  try {
    const { member_id, amount, tenor, purpose, type } = req.body;
    const request_number = `LOAN${Date.now()}`;
    const loanId = await loanModel.create({ member_id, request_number, amount, tenor, purpose, type, status: 'PENDING' });
    const member = await MemberModel.findById(member_id);
    
    getAIRecommendation(member, { amount, purpose, tenor }).then(async (aiResult) => {
      if (aiResult) {
        const ai_score = aiResult.recommendation === 'LAYAK' ? 80 : 20;
        const max_approved_amount = aiResult.prob_default ? amount * (1 - aiResult.prob_default) : amount * 0.8;
        await loanModel.updateAIResult(loanId, {
          ai_score,
          ai_recommendation: aiResult.recommendation,
          prob_default: aiResult.prob_default,
          risk_level: aiResult.risk_level,
          max_approved_amount,
        });
        console.log(`[AI] Loan ${loanId} updated with AI result.`);
      } else {
        console.warn(`[AI] No result from AI service for loan ${loanId}.`);
      }
    }).catch(err => console.error('[AI] Background error:', err));
    
    res.status(201).json({ success: true, loanId });
  } catch (err) { 
    next(err); 
  }
  
};