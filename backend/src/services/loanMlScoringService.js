import axios from 'axios';
import * as MemberModel from '../models/MemberModel.js';

const ML_API_BASE_URL = process.env.ML_API_BASE_URL || 'http://127.0.0.1:8000';
const TIMEOUT = 8000;

function buildPayload(member, loan) {
    let days_birth = -10950;
    if (member.birth_date) {
        const birth = new Date(member.birth_date);
        const today = new Date();
        const diffTime = today - birth;
        days_birth = -Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }
    const amt_annuity = loan.amount / loan.tenor;

    // Kalkulasi ext_source secara dinamis berdasarkan histori & profil anggota di koperasi
    let ext_score = 0.5; // base score (netral)

    // 1. Durasi Keanggotaan (Semakin lama menjadi anggota, semakin terpercaya)
    if (member.tenure_months >= 12) ext_score += 0.15;
    else if (member.tenure_months >= 6) ext_score += 0.05;
    else ext_score -= 0.05;

    // 2. Saldo Pinjaman Berjalan (Memiliki hutang aktif menurunkan credit score)
    if (member.existing_loan_balance > 0) ext_score -= 0.15;
    else ext_score += 0.10;

    // 3. Jaminan (Adanya jaminan menaikkan kepercayaan / menurunkan risiko default)
    if (member.has_collateral) ext_score += 0.10;
    else ext_score -= 0.05;

    // Batasi nilai agar tetap berada dalam range valid 0.1 s/d 0.9 (API ML butuh range 0.0 - 1.0)
    ext_score = Math.max(0.1, Math.min(0.9, ext_score));

    return {
        code_gender: member.code_gender || 'M',
        name_income_type: member.income_type || 'Working',
        name_education_type: member.education || 'Secondary / secondary special',
        name_family_status: member.family_status || 'Married',
        occupation_type: member.occupation || 'Laborers',
        flag_own_car: (member.vehicle_type === 'Mobil' || member.vehicle_type === 'Mobil & Motor' || member.own_car) ? 'Y' : 'N',
        flag_own_realty: (member.property_type === 'Rumah Pribadi' || member.own_realty) ? 'Y' : 'N',
        cnt_children: member.children_count || 0,
        cnt_fam_members: member.family_members || 2,
        amt_income_total: member.monthly_income || 1,
        amt_credit: loan.amount,
        amt_annuity: amt_annuity,
        amt_goods_price: loan.amount,
        days_birth: days_birth,
        days_employed: member.employed_days || -1825,
        days_last_phone_change: member.last_phone_change_days || -180,
        ext_source_1: ext_score,
        ext_source_2: ext_score,
        ext_source_3: ext_score
    };
}

export async function scoreLoanApplication(memberId, loanData) {
    const member = await MemberModel.findById(memberId);
    if (!member) throw new Error('Anggota tidak ditemukan');

    const payload = buildPayload(member, loanData);
    console.log('[ML] Sending payload:', JSON.stringify(payload, null, 2));

    try {
        const response = await axios.post(`${ML_API_BASE_URL}/predict`, payload, { timeout: TIMEOUT });
        console.log('[ML] Response:', response.data);

        // Ambil field dari respons ML API
        const prob_default = response.data.prob_default;

        if (prob_default === undefined) throw new Error('ML response missing prob_default');

        // ── Skor 3 zona ──────────────────────────────────────────────────
        // ✅ LAYAK            (prob_default < 0.666)  → skor 75 — 100
        // ⚠️  DIPERTIMBANGKAN (0.666 ≤ prob < 0.866) → skor 25 — 74
        // ❌ TIDAK LAYAK      (prob_default ≥ 0.866)  → skor  0 — 24
        const prob_berhasil = 1 - prob_default;
        let ai_score;

        if (prob_default < 0.400) {
            // LAYAK (prob_berhasil > 60%): Skor 75 - 100
            ai_score = Math.round(75 + ((prob_berhasil - 0.6) / 0.4) * 25);
        } else if (prob_default < 0.666) {
            // PERLU DIPERTIMBANGKAN (prob_berhasil 33.5% - 60%): Skor 25 - 74
            ai_score = Math.round(25 + ((prob_berhasil - 0.335) / (0.6 - 0.335)) * 49);
        } else {
            // TIDAK LAYAK (prob_berhasil < 33.5%): Skor 0 - 24
            ai_score = Math.round((prob_berhasil / 0.334) * 24);
        }

        // ── Heuristik Score Modifier di Backend ────────────────────────────
        let final_score = ai_score;

        // 🚗 Modifier Kendaraan
        // Jika jumlah kendaraan >= 2 (seperti 'Mobil & Motor'), beri bonus +3 poin.
        // Jika hanya 'Motor', beri bonus +3 poin (karena ML mendeteksi 'N' tapi motor tetap aset berharga).
        // Jika hanya 'Mobil', biarkan skor dasar (tidak ditambah karena sudah terhitung 'Y' di ML).
        if (member.vehicle_type === 'Mobil & Motor') {
            final_score += 3;
        } else if (member.vehicle_type === 'Motor') {
            final_score += 3;
        }

        // 🏠 Modifier Properti
        // Jika 'Rumah Pribadi', biarkan skor dasar (sudah terhitung 'Y' di ML).
        // Jika 'Rumah Dinas', beri bonus +2 karena jauh lebih stabil dibanding sewa/kontrak biasa.
        // Jika 'Sewa / Kontrak' atau 'Sewa/Kontrak', kurangi skor -2.
        const propType = member.property_type ? member.property_type.trim() : '';
        if (propType === 'Rumah Dinas') {
            final_score += 2;
        } else if (propType === 'Sewa / Kontrak' || propType === 'Sewa/Kontrak') {
            final_score -= 2;
        }

        ai_score = Math.max(0, Math.min(100, final_score));

        // Tentukan keputusan final rekomendasi & risk level dari skor akhir yang sudah dimodifikasi
        let recommendation;
        let risk_level;
        if (ai_score >= 75) {
            recommendation = 'LAYAK';
            risk_level = 'LOW';
        } else if (ai_score >= 25) {
            recommendation = 'PERLU_DIPERTIMBANGKAN';
            risk_level = 'MEDIUM';
        } else {
            recommendation = 'TIDAK_LAYAK';
            risk_level = 'HIGH';
        }
        
        return { recommendation, prob_default, ai_score, risk_level };
    } catch (error) {
        console.error('[ML] Error calling ML API:', error.message);
        throw new Error(`ML API failed: ${error.message}`);
    }
}