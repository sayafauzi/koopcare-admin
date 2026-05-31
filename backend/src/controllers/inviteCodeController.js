import * as inviteCodeService from '../services/inviteCodeService.js';

// GET /admin/invite-codes
export const getInviteCodes = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { data, total } = await inviteCodeService.getInviteCodes(page, limit);
        res.json({
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) { next(err); }
};

// GET /admin/invite-codes/:id
export const getInviteCodeDetail = async (req, res, next) => {
    try {
        const code = await inviteCodeService.getInviteCodeById(req.params.id);
        if (!code) return res.status(404).json({ error: 'Kode tidak ditemukan' });
        res.json({ success: true, data: code });
    } catch (err) { next(err); }
};

// POST /admin/invite-codes
export const createInviteCode = async (req, res, next) => {
    try {
        const { validDays = 30, maxUses = 1 } = req.body;
        const adminId = req.user.id; // dari middleware auth
        const code = await inviteCodeService.createInviteCode(adminId, validDays, maxUses);
        res.status(201).json({ success: true, data: code });
    } catch (err) { next(err); }
};

// PATCH /admin/invite-codes/:id/revoke
export const revokeInviteCode = async (req, res, next) => {
    try {
        await inviteCodeService.revokeInviteCode(req.params.id);
        res.json({ success: true, message: 'Kode undangan berhasil dicabut' });
    } catch (err) { next(err); }
};

// PATCH /admin/invite-codes/:id/extend
export const extendInviteCodeValidity = async (req, res, next) => {
    try {
        const { additionalDays } = req.body;
        if (!additionalDays || additionalDays <= 0) {
            return res.status(400).json({ error: 'Jumlah hari harus positif' });
        }
        const newValidUntil = await inviteCodeService.extendValidity(req.params.id, additionalDays);
        res.json({ success: true, message: 'Masa berlaku diperpanjang', valid_until: newValidUntil });
    } catch (err) { next(err); }
};

export const validateInviteCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const result = await inviteCodeService.validateCode(code);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const useInviteCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const record = await inviteCodeService.useInviteCode(code);
    res.json({ success: true, message: 'Kode digunakan', data: record });
  } catch (err) { next(err); }
};