import * as inviteCodeModel from '../models/InviteCodeModel.js';
import { generateRandomCode } from '../utils/helpers.js'; // pastikan helpers.js punya generateRandomCode

// Mendapatkan daftar kode (untuk admin)
export const getInviteCodes = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    return await inviteCodeModel.findAll(limit, offset);
};

// Mendapatkan detail kode berdasarkan ID
export const getInviteCodeById = async (id) => {
    return await inviteCodeModel.findById(id);
};

// Membuat kode baru (oleh admin)
export const createInviteCode = async (adminId, validDays = 30, maxUses = 1) => {
    const code = generateRandomCode(10);
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validDays);
    const id = await inviteCodeModel.create(code, adminId, validUntil, maxUses);
    return { id, code, validUntil, maxUses };
};

// Mencabut kode
export const revokeInviteCode = async (id) => {
    await inviteCodeModel.revoke(id);
    return true;
};

// Memperpanjang masa berlaku (tambah hari)
export const extendValidity = async (id, additionalDays) => {
    const record = await inviteCodeModel.findById(id);
    if (!record) throw new Error('Kode tidak ditemukan');
    const newValidUntil = new Date(record.valid_until);
    newValidUntil.setDate(newValidUntil.getDate() + additionalDays);
    await inviteCodeModel.updateValidity(id, newValidUntil);
    return newValidUntil;
};


export const validateCode = async (code) => {
  await inviteCodeModel.deactivateExpired();
  const record = await inviteCodeModel.findByCode(code);
  if (!record) return { valid: false, message: 'Kode tidak ditemukan' };
  if (record.status !== 'active') return { valid: false, message: 'Kode tidak aktif' };
  if (record.used_count >= record.max_uses) return { valid: false, message: 'Kode sudah habis dipakai' };
  return { valid: true, record };
};

export const useInviteCode = async (code) => {
  const { valid, record, message } = await validateCode(code);
  if (!valid) throw new Error(message);
  await inviteCodeModel.incrementUsed(record.id);
  return record;
};