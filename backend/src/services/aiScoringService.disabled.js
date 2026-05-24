/**
 * Dummy AI Scoring Service
 * Menghitung skor kelayakan pinjaman berdasarkan data anggota.
 * Skor 0-100, makin tinggi makin layak.
 */
// export const calculateScore = (memberData) => {
//   // memberData: { tenureMonths, monthlyIncome, existingLoanBalance, hasCollateral }
//   let score = 50; // base
  
//   if (memberData.tenureMonths >= 12) score += 20;
//   else if (memberData.tenureMonths >= 6) score += 10;
  
//   if (memberData.monthlyIncome > 5000000) score += 15;
//   else if (memberData.monthlyIncome > 2000000) score += 5;
  
//   if (memberData.existingLoanBalance === 0) score += 10;
  
//   if (memberData.hasCollateral) score += 5;
  
//   return Math.min(100, Math.max(0, score));
// };

// export const getMaxApprovalAmount = (score, requestedAmount, monthlyIncome) => {
//   if (score < 60) return 0;
//   if (score >= 80) return requestedAmount;
//   // antara 60-79, maksimal 50% dari pendapatan bulanan * 12
//   const maxBasedOnIncome = monthlyIncome * 12 * 0.5;
//   return Math.min(requestedAmount, maxBasedOnIncome);
// };

// backend/src/services/aiScoringService.js
import axios from 'axios';

const ML_API_BASE_URL = process.env.ML_API_BASE_URL || 'http://127.0.0.1:8000';
const TIMEOUT = parseInt(process.env.ML_API_TIMEOUT_MS) || 5000;

function calculateDaysSince(date) {
    if (!date) return -10950; // default 30 tahun
    const diffTime = new Date() - new Date(date);
    return -Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function mapToAIRequest(member, loan) {
    const amt_annuity = loan.amount / loan.tenor;

    return {
        tenure_months: member.tenure_months || 1,      // minimal 1 agar tidak 0
        monthly_income: member.monthly_income || 1000000, // fallback 1jt
        loan_amount: loan.amount,
        loan_purpose: loan.purpose || 'others',
        existing_loan_balance: member.existing_loan_balance || 0,
        has_collateral: member.has_collateral ? 1 : 0,
        code_gender: member.code_gender || 'M',
        name_income_type: 'Working',
        name_education_type: member.education || 'Secondary / secondary special',
        name_family_status: member.family_status || 'Married',
        occupation_type: member.occupation || 'Laborers',
        flag_own_car: member.own_car ? 'Y' : 'N',
        flag_own_realty: member.own_realty ? 'Y' : 'N',
        cnt_children: member.children_count || 0,
        cnt_fam_members: member.family_members || 1,
        amt_income_total: member.monthly_income || 1,   // minimal 1
        amt_credit: loan.amount,
        amt_annuity: amt_annuity,
        amt_goods_price: loan.amount,
        days_birth: calculateDaysSince(member.birth_date),
        days_employed: member.employed_days || -1825,
        days_last_phone_change: member.last_phone_change_days || -180,
    };
}

export async function getAIRecommendation(member, loan) {
    console.log('[AI] Called with member ID:', member?.id, 'loan amount:', loan?.amount);
    try {
        const payload = mapToAIRequest(member, loan);
        console.log('[AI] Payload:', JSON.stringify(payload, null, 2));
        const response = await axios.post(`${ML_API_BASE_URL}/predict`, payload, { timeout: TIMEOUT });
        console.log('[AI] Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('[AI] Error:', error.message);
        if (error.response) {
            console.error('[AI] Response status:', error.response.status);
            console.error('[AI] Response data:', error.response.data);
        }
        return null;
    }
}