import * as MemberModel from '../models/MemberModel.js';
import * as KycModel from '../models/KycModel.js';
import * as LoanModel from '../models/LoanModel.js';
import * as TransactionModel from '../models/TransactionModel.js';
import * as NotificationModel from '../models/NotificationModel.js';
import { sendOTP } from '../services/whatsappService.js';
import * as notificationModel from '../models/NotificationModel.js';
import { hashPin, verifyPin, generateRandomPin } from '../services/pinService.js';
import { getAIRecommendation } from '../services/aiScoringService.js';
import jwt from 'jsonwebtoken';

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
        const existing = await MemberModel.findByNIK(nik);
        if (existing) return res.status(400).json({ error: 'NIK sudah terdaftar' });
        
        const hashedPin = await hashPin(pin);
        const memberId = await MemberModel.createMember({
            fullName: full_name,
            nik,
            phone,
            email: email || null,
            pin: hashedPin,
            status: 'ACTIVE',
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
        res.status(201).json({ success: true, token, user: { id: memberId, name: full_name, phone, email } });
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
        const member = await MemberModel.findByPhone(identifier) || await MemberModel.findByEmail(identifier);
        if (!member) return res.status(404).json({ error: 'Pengguna tidak ditemukan' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000;
        otpStore.set(identifier, { otp, expiresAt });

        // Kirim via WhatsApp
        const sent = await sendOTP(member.phone, otp);
        if (!sent) {
            console.log(`[OTP] Fallback untuk ${identifier}: ${otp}`);
        }
        res.json({ success: true, message: 'Kode OTP dikirim via WhatsApp' });
    } catch (err) { next(err); }
};

export const verifyOtp = async (req, res, next) => {
    try {
        const { identifier, otp } = req.body;
        const stored = otpStore.get(identifier);
        if (!stored || stored.otp !== otp || stored.expiresAt < Date.now()) {
            return res.status(400).json({ error: 'OTP tidak valid atau kadaluarsa' });
        }
        otpStore.delete(identifier);
        res.json({ success: true, message: 'OTP valid' });
    } catch (err) { next(err); }
};

export const mobileLogin = async (req, res, next) => {
    try {
        const { identifier, pin } = req.body;
        let member = await MemberModel.findByEmail(identifier);
        if (!member) member = await MemberModel.findByPhone(identifier);
        if (!member) return res.status(401).json({ error: 'Akun tidak ditemukan' });
        const isValid = await verifyPin(pin, member.pin);
        if (!isValid) return res.status(401).json({ error: 'PIN salah' });
        if (member.role !== 'member') return res.status(403).json({ error: 'Akses hanya untuk anggota' });
        const token = jwt.sign(
            { id: member.id, role: member.role, name: member.full_name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({ success: true, token, user: { id: member.id, name: member.full_name, phone: member.phone, email: member.email } });
    } catch (err) { next(err); }
};

export const mobileResetPin = async (req, res, next) => {
    try {
        const { identifier, otp, newPin } = req.body;
        const stored = otpStore.get(identifier);
        if (!stored || stored.otp !== otp || stored.expiresAt < Date.now()) {
            return res.status(400).json({ error: 'OTP tidak valid' });
        }
        let member = await MemberModel.findByEmail(identifier);
        if (!member) member = await MemberModel.findByPhone(identifier);
        if (!member) return res.status(404).json({ error: 'Akun tidak ditemukan' });
        if (!/^\d{6}$/.test(newPin)) return res.status(400).json({ error: 'PIN harus 6 digit' });
        const hashedPin = await hashPin(newPin);
        await MemberModel.updatePin(member.id, hashedPin);
        otpStore.delete(identifier);
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
        const { monthly_income, birth_date, education, occupation, own_car, own_realty, children_count, family_members, ...others } = req.body;
        await MemberModel.update(req.user.id, {
            monthly_income,
            birth_date,
            education,
            occupation,
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
        const { ktp_photo_url, selfie_photo_url } = req.body;
        if (!ktp_photo_url || !selfie_photo_url) {
            return res.status(400).json({ error: 'Foto KTP dan selfie wajib diisi' });
        }

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

        // Simpan pengajuan KYC
        const kycId = await KycModel.create({
            member_id: req.user.id,
            full_name: member.full_name,
            nik: member.nik,
            phone: member.phone,
            status: 'PENDING',
            ktp_photo_url,
            selfie_photo_url
        });

        res.status(201).json({ success: true, message: 'Pengajuan KYC berhasil', kycId });
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
        const { amount, tenor, purpose, type } = req.body;
        const request_number = `LOAN${Date.now()}`;
        const loanId = await LoanModel.create({
            member_id: req.user.id,
            request_number,
            amount,
            tenor,
            purpose,
            type,
            status: 'PENDING'
        });
        // Panggil AI di background
        const member = await MemberModel.findById(req.user.id);
        getAIRecommendation(member, { amount, purpose, tenor }).then(async (aiResult) => {
            if (aiResult) {
                const ai_score = aiResult.recommendation === 'LAYAK' ? 80 : 20;
                const max_approved_amount = aiResult.prob_default ? amount * (1 - aiResult.prob_default) : amount * 0.8;
                await LoanModel.updateAIResult(loanId, {
                    ai_score,
                    ai_recommendation: aiResult.recommendation,
                    prob_default: aiResult.prob_default,
                    risk_level: aiResult.risk_level,
                    max_approved_amount,
                });
            }
        }).catch(err => console.error('AI error:', err));
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