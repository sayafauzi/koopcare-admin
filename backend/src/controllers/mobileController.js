import * as MemberModel from '../models/MemberModel.js';
import * as KycModel from '../models/KycModel.js';
import * as LoanModel from '../models/LoanModel.js';
import * as TransactionModel from '../models/TransactionModel.js';
import * as NotificationModel from '../models/NotificationModel.js';
import { sendOTP } from '../services/whatsappService.js';
import * as notificationModel from '../models/NotificationModel.js';
import { hashPin, verifyPin, generateRandomPin } from '../services/pinService.js';
import { scoreLoanApplication } from '../services/loanMlScoringService.js';
import jwt from 'jsonwebtoken';
import { normalizePhone, normalizeIdentifier, validatePhone } from '../utils/validators.js';
import * as InstallmentModel from '../models/InstallmentModel.js';
import * as transactionService from '../services/transactionService.js';
import pool from '../config/database.js';


// Helper untuk OTP sederhana (simulasi, bisa diganti dengan WhatsApp)
const otpStore = new Map();

// ========== Registrasi & Login ==========

export const registerMember = async (req, res, next) => {
    try {
        const { full_name, nik, phone, email, pin, monthly_income, birth_date, education, occupation, ...others } = req.body;
        // Validasi
        if (!full_name || !nik || !phone || !pin) {
            return res.status(400).json({ error: 'Nama, NIK, telepon, dan PIN wajib diisi' });
        }
        if (!/^\d{16}$/.test(nik)) return res.status(400).json({ error: 'NIK harus 16 digit' });
        if (!/^\d{6}$/.test(pin)) return res.status(400).json({ error: 'PIN harus 6 digit' });
        if (!validatePhone(phone)) {
            return res.status(400).json({ error: 'Nomor telepon tidak valid (format yang didukung: 08xx, 628xx, atau +628xx)' });
        }
        
        const normalizedPhone = normalizePhone(phone);
        const existing = await MemberModel.findByNIK(nik);
        if (existing) return res.status(400).json({ error: 'NIK sudah terdaftar' });
        
        const hashedPin = await hashPin(pin);
        const memberId = await MemberModel.createMember({
            fullName: full_name,
            nik,
            phone: normalizedPhone,
            email: email || null,
            pin: hashedPin,
            status: 'INACTIVE',
            role: 'member',
            monthly_income: monthly_income || 0,
            birth_date: birth_date || null,
            education: education || null,
            occupation: occupation || null,
            ...others
        });
        // Generate token
        const token = jwt.sign(
            { id: memberId, role: 'member', name: full_name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.status(201).json({ success: true, token, user: { id: memberId, name: full_name, phone: normalizedPhone, email, status: 'INACTIVE' } });
    } catch (err) { next(err); }
};

// export const requestOtp = async (req, res, next) => {
//     try {
//         const { identifier } = req.body;
//         if (!identifier) return res.status(400).json({ error: 'Nomor WhatsApp atau email wajib' });
//         let member = await MemberModel.findByEmail(identifier);
//         if (!member) member = await MemberModel.findByPhone(identifier);
//         if (!member) return res.status(404).json({ error: 'Akun tidak ditemukan' });
//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         const expiresAt = Date.now() + 10 * 60 * 1000;
//         otpStore.set(identifier, { otp, expiresAt });
//         console.log(`[OTP] untuk ${identifier}: ${otp}`);
//         // TODO: kirim WhatsApp
//         res.json({ success: true, message: 'Kode OTP dikirim', otp }); // mynote: Hanya untuk development! hapus bila sudah di production
//     } catch (err) { next(err); }
// };

export const requestOtp = async (req, res, next) => {
    try {
        const { identifier } = req.body;
        const normalizedIdentifier = normalizeIdentifier(identifier);
        const member = await MemberModel.findByPhone(normalizedIdentifier) || await MemberModel.findByEmail(normalizedIdentifier);
        if (!member) return res.status(404).json({ error: 'Pengguna tidak ditemukan' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000;
        otpStore.set(normalizedIdentifier, { otp, expiresAt });

        // Kirim via WhatsApp
        const sent = await sendOTP(member.phone, otp);
        if (!sent) {
            console.log(`[OTP] Fallback untuk ${normalizedIdentifier}: ${otp}`);
        }
        // res.json({ success: true, message: 'Kode OTP dikirim via WhatsApp' });
        res.json({ success: true, message: 'Kode OTP dikirim', otp });
    } catch (err) { next(err); }
};

export const verifyOtp = async (req, res, next) => {
    try {
        const { identifier, otp } = req.body;
        const normalizedIdentifier = normalizeIdentifier(identifier);

        if (process.env.USE_DUMMY_OTP === 'true' && otp === process.env.DUMMY_OTP_CODE) {
            console.log(`[OTP] Mode DUMMY: Verifikasi OTP berhasil untuk ${normalizedIdentifier} dengan kode tetap.`);
            return res.json({ success: true, message: 'OTP valid' });
        }

        const stored = otpStore.get(normalizedIdentifier);
        if (!stored || stored.otp !== otp || stored.expiresAt < Date.now()) {
            return res.status(400).json({ error: 'OTP tidak valid atau kadaluarsa' });
        }
        otpStore.delete(normalizedIdentifier);
        res.json({ success: true, message: 'OTP valid' });
    } catch (err) { next(err); }
};

export const mobileLogin = async (req, res, next) => {
    try {
        const { identifier, pin } = req.body;
        const normalizedIdentifier = normalizeIdentifier(identifier);
        let member = await MemberModel.findByEmail(normalizedIdentifier);
        if (!member) member = await MemberModel.findByPhone(normalizedIdentifier);
        if (!member) return res.status(401).json({ error: 'Akun tidak ditemukan' });
        const isValid = await verifyPin(pin, member.pin);
        if (!isValid) return res.status(401).json({ error: 'PIN salah' });
        if (member.role !== 'member') return res.status(403).json({ error: 'Akses hanya untuk anggota' });
        const token = jwt.sign(
            { id: member.id, role: member.role, name: member.full_name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({ success: true, token, user: { id: member.id, name: member.full_name, phone: member.phone, email: member.email, status: member.status } });
    } catch (err) { next(err); }
};

export const mobileResetPin = async (req, res, next) => {
    try {
        const { identifier, otp, newPin } = req.body;
        const normalizedIdentifier = normalizeIdentifier(identifier);
        const stored = otpStore.get(normalizedIdentifier);
        if (!stored || stored.otp !== otp || stored.expiresAt < Date.now()) {
            return res.status(400).json({ error: 'OTP tidak valid' });
        }
        let member = await MemberModel.findByEmail(normalizedIdentifier);
        if (!member) member = await MemberModel.findByPhone(normalizedIdentifier);
        if (!member) return res.status(404).json({ error: 'Akun tidak ditemukan' });
        if (!/^\d{6}$/.test(newPin)) return res.status(400).json({ error: 'PIN harus 6 digit' });
        const hashedPin = await hashPin(newPin);
        await MemberModel.updatePin(member.id, hashedPin);
        otpStore.delete(normalizedIdentifier);
        res.json({ success: true, message: 'PIN berhasil direset' });
    } catch (err) { next(err); }
};

// ========== Profil & KYC ==========

export const getProfile = async (req, res, next) => {
    try {
        const member = await MemberModel.findById(req.user.id);
        if (!member) return res.status(404).json({ error: 'Anggota tidak ditemukan' });
        res.json({ success: true, data: member });
    } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { monthly_income, birth_date, education, occupation, income_type, own_car, own_realty, children_count, family_members, ...others } = req.body;
        await MemberModel.update(req.user.id, {
            monthly_income,
            birth_date,
            education,
            occupation,
            income_type,
            own_car,
            own_realty,
            children_count,
            family_members,
            ...others
        });
        res.json({ success: true, message: 'Profil diperbarui' });
    } catch (err) { next(err); }
};

export const submitKyc = async (req, res, next) => {
    try {
        // File diterima via multipart/form-data, sudah diupload ke Cloudinary oleh multer
        const ktpFile = req.files?.ktp_photo?.[0];
        const selfieFile = req.files?.selfie_photo?.[0];

        if (!ktpFile || !selfieFile) {
            return res.status(400).json({ error: 'Foto KTP dan selfie wajib diisi' });
        }

        // URL hasil upload Cloudinary
        const ktp_photo_url = ktpFile.path;
        const selfie_photo_url = selfieFile.path;

        // Ambil data member dari database
        const member = await MemberModel.findById(req.user.id);
        if (!member) {
            return res.status(404).json({ error: 'Anggota tidak ditemukan' });
        }

        // Cek apakah sudah ada pengajuan KYC yang masih pending
        const existingPending = await KycModel.findPendingByMemberId(req.user.id);
        if (existingPending) {
            return res.status(400).json({ error: 'Anda sudah memiliki pengajuan KYC yang sedang diproses' });
        }

        // Simpan pengajuan KYC dengan URL dari Cloudinary
        const kycId = await KycModel.create({
            member_id: req.user.id,
            full_name: member.full_name,
            nik: member.nik,
            phone: member.phone,
            status: 'PENDING',
            ktp_photo_url,
            selfie_photo_url,
        });

        res.status(201).json({
            success: true,
            message: 'Pengajuan KYC berhasil',
            kycId,
            ktp_photo_url,
            selfie_photo_url,
        });
    } catch (err) {
        next(err);
    }
};

export const getKycStatus = async (req, res, next) => {
    try {
        const submissions = await KycModel.findByMemberId(req.user.id);
        const latest = submissions[0]; // urutkan berdasarkan created_at DESC
        res.json({ success: true, data: latest || null });
    } catch (err) { next(err); }
};

// ========== Pinjaman & Transaksi ==========

export const getMemberLoans = async (req, res, next) => {
    try {
        const loans = await LoanModel.findByMemberId(req.user.id);
        res.json({ success: true, data: loans });
    } catch (err) { next(err); }
};

export const applyLoan = async (req, res, next) => {
    try {
        let { amount, tenor, purpose, type } = req.body;

        // ── Sanitasi & Validasi amount ───────────────────────────────
        // Strip karakter non-numerik (titik/koma pemisah ribuan) lalu parse
        const rawAmount = String(amount ?? '').replace(/[^0-9]/g, '');
        const numAmount = parseInt(rawAmount, 10);

        if (!rawAmount || isNaN(numAmount) || numAmount <= 0) {
            return res.status(400).json({ error: 'Jumlah pembiayaan tidak valid.' });
        }
        if (numAmount < 100000) {
            return res.status(400).json({ error: 'Jumlah pembiayaan minimal Rp 100.000.' });
        }
        if (numAmount > 500000000) {
            return res.status(400).json({ error: 'Jumlah pembiayaan maksimal Rp 500.000.000.' });
        }
        amount = numAmount; // gunakan nilai bersih

        // ── Sanitasi tenor ───────────────────────────────────────────
        const numTenor = parseInt(tenor, 10);
        if (isNaN(numTenor) || numTenor <= 0) {
            return res.status(400).json({ error: 'Tenor tidak valid.' });
        }
        tenor = numTenor;

        // ── Sanitasi purpose ────────────────────────────────────────
        purpose = String(purpose ?? '').trim();
        if (!purpose || purpose.length < 3) {
            return res.status(400).json({ error: 'Tujuan pembiayaan harus diisi (min. 3 karakter).' });
        }
        if (purpose.length > 255) {
            return res.status(400).json({ error: 'Tujuan pembiayaan terlalu panjang.' });
        }

        // ── Sanitasi type ────────────────────────────────────────────
        const validTypes = ['MURABAHAH', 'QARDHUL_HASAN'];
        type = String(type ?? '').trim().toUpperCase();
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: 'Jenis produk pembiayaan tidak valid.' });
        }

        // Cek status keaktifan anggota
        const member = await MemberModel.findById(req.user.id);
        if (!member) {
            return res.status(404).json({ error: 'Anggota tidak ditemukan' });
        }
        if (member.status !== 'ACTIVE') {
            return res.status(403).json({ error: 'Akun Anda belum aktif. Harap verifikasi KYC terlebih dahulu.' });
        }

        const request_number = `K${Date.now()}`;
        const loanId = await LoanModel.create({
            member_id: req.user.id,
            request_number,
            amount,
            tenor,
            purpose,
            type,
            status: 'PENDING'
        });
        
        // Panggil AI di background (jangan blokir response)
        scoreLoanApplication(req.user.id, { amount, tenor, purpose })
            .then(async ({ recommendation, prob_default, ai_score, risk_level }) => {
                const max_approved_amount = prob_default ? amount * (1 - prob_default) : amount * 0.8;
                await LoanModel.updateAIResult(loanId, {
                    ai_score,
                    ai_recommendation: recommendation,
                    prob_default,
                    risk_level,
                    max_approved_amount,
                });
                // Tambahkan notifikasi AI selesai
                const formattedAmount = `Rp${Number(amount).toLocaleString('id-ID')}`;
                await notificationModel.create(req.user.id, 'Analisis AI Selesai', `Pengajuan pinjaman ${formattedAmount} Anda telah dianalisis. Skor kelayakan: ${ai_score} (${recommendation})`);
                console.log(`[AI] Loan ${loanId} updated with ML result.`);
            })
            .catch(err => console.error('[AI] Background error:', err));
        
        res.status(201).json({ success: true, loanId });
    } catch (err) { next(err); }
};

export const getLoanDetailMember = async (req, res, next) => {
    try {
        const loan = await LoanModel.findById(req.params.id);
        if (!loan || loan.member_id !== req.user.id) return res.status(404).json({ error: 'Pinjaman tidak ditemukan' });
        res.json({ success: true, data: loan });
    } catch (err) { next(err); }
};

export const getMemberTransactions = async (req, res, next) => {
    try {
        const transactions = await TransactionModel.findByMemberId(req.user.id);
        res.json({ success: true, data: transactions });
    } catch (err) { next(err); }
};

// ========== Notifikasi ==========
export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await notificationModel.findByMemberId(req.user.id);
        res.json({ success: true, data: notifications });
    } catch (err) { next(err); }
};

export const getUnreadNotificationCount = async (req, res, next) => {
    try {
        const count = await notificationModel.getUnreadCount(req.user.id);
        res.json({ success: true, count });
    } catch (err) { next(err); }
};

export const markNotificationRead = async (req, res, next) => {
    try {
        await notificationModel.markAsRead(req.params.id, req.user.id);
        res.json({ success: true });
    } catch (err) { next(err); }
};

// Jika ingin mark all read, buat endpoint terpisah
export const markAllNotificationsRead = async (req, res, next) => {
    try {
        await notificationModel.markAllAsRead(req.user.id);
        res.json({ success: true });
    } catch (err) { next(err); }
};

// GET /mobile/loans/:id/installments
export const getLoanInstallments = async (req, res, next) => {
    try {
        const loan = await LoanModel.findById(req.params.id);
        if (!loan || loan.member_id !== req.user.id) {
            return res.status(404).json({ error: 'Pinjaman tidak ditemukan' });
        }
        const installments = await InstallmentModel.findByLoanId(req.params.id);
        res.json({ success: true, data: installments });
    } catch (err) { next(err); }
};

// POST /mobile/loans/:loanId/installments/:installmentId/pay-balance
export const payInstallmentFromBalance = async (req, res, next) => {
    try {
        const { loanId, installmentId } = req.params;

        // 1. Ownership + existence
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
        const next = await InstallmentModel.findNextUnpaid(loanId);
        if (!next || next.id !== installment.id) {
            return res.status(400).json({
                error: 'Harap bayar cicilan sebelumnya terlebih dahulu',
            });
        }

        // 3. Debit balance via the existing transaction service (it checks
        //    sufficient balance and throws 'Saldo tidak mencukupi' if not).
        //    recordTransaction with BAYAR_ANGSURAN already debits members.balance.
        const transactionId = await transactionService.recordTransaction({
            member_id: req.user.id,
            type: 'BAYAR_ANGSURAN',
            amount: Number(installment.amount),
            description: `Pembayaran cicilan #${installment.installment_number} (${loan.request_number})`,
            reference_id: String(loanId),
            cashier_id: null,
        });

        // 4. Mark installment paid, linked to that ledger row.
        await InstallmentModel.markPaid(installment.id, transactionId);

        // 5. If that was the last installment, mark loan PAID_OFF.
        const remaining = await InstallmentModel.findNextUnpaid(loanId);
        if (!remaining) {
            await pool.query(`UPDATE loans SET status = 'PAID_OFF' WHERE id = ?`, [loanId]);
        }

        res.json({ success: true, message: 'Cicilan berhasil dibayar', transactionId });
    } catch (err) {
        // recordTransaction throws 'Saldo tidak mencukupi' — surface as 400
        if (err.message?.includes('Saldo tidak mencukupi')) {
            return res.status(400).json({ error: 'Saldo tidak mencukupi' });
        }
        next(err);
    }
};

export const executeTransfer = async (req, res, next) => {
    try {
        const { amount, bank, rekening } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Nominal transfer harus lebih dari 0' });
        }
        if (!bank) {
            return res.status(400).json({ error: 'Bank tujuan harus diisi' });
        }
        if (!rekening) {
            return res.status(400).json({ error: 'Nomor rekening tujuan harus diisi' });
        }

        const transactionId = await transactionService.recordTransaction({
            member_id: req.user.id,
            type: 'TRANSFER',
            amount: Number(amount),
            description: `Transfer ke ${bank} - ${rekening}`,
            reference_id: null,
            cashier_id: null,
        });

        res.json({
            success: true,
            message: 'Transfer berhasil',
            transactionId
        });
    } catch (err) {
        if (err.message?.includes('Saldo tidak mencukupi')) {
            return res.status(400).json({ error: 'Saldo tidak mencukupi' });
        }
        next(err);
    }
};

export { createTopup, getTopupStatus } from './paymentController.js';