// backend/src/controllers/memberController.js
import * as memberModel from '../models/MemberModel.js';
import { generateRandomPin, hashPin } from '../services/pinService.js';
import { sendOTP } from '../services/whatsappService.js';

export const getMembers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const role = req.query.role || null; // 'admin', 'member', atau null (semua)
    const { data, total } = await memberModel.findAll(limit, offset, search, role);
    res.json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (err) {
    next(err);
  }
};

export const getMemberById = async (req, res, next) => {
  try {
    const member = await memberModel.findById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Anggota tidak ditemukan' });
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

// export const resetMemberPin = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const member = await memberModel.findById(id);
//     if (!member) return res.status(404).json({ error: 'Anggota tidak ditemukan' });
//     const newPin = generateRandomPin();
//     const hashedPin = await hashPin(newPin);
//     await memberModel.updatePin(id, hashedPin);
//     // TODO: Kirim PIN via WhatsApp (akan diintegrasi nanti)
//     res.json({ success: true, message: 'PIN berhasil direset', newPin });
//   } catch (err) {
//     next(err);
//   }
// };

export const resetMemberPin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const member = await memberModel.findById(id);
        if (!member) return res.status(404).json({ error: 'Anggota tidak ditemukan' });
        const newPin = generateRandomPin();
        const hashedPin = await hashPin(newPin);
        await memberModel.updatePin(id, hashedPin);
        // Kirim PIN via WhatsApp
        await sendOTP(member.phone, `PIN baru Anda: ${newPin}`);
        res.json({ success: true, message: 'PIN berhasil direset', newPin });
    } catch (err) { next(err); }
};

export const toggleMemberStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = await memberModel.findById(id);
    if (!member) return res.status(404).json({ error: 'Anggota tidak ditemukan' });
    const newStatus = member.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await memberModel.updateStatus(id, newStatus);
    res.json({ success: true, message: `Status anggota diubah menjadi ${newStatus}`, status: newStatus });
  } catch (err) {
    next(err);
  }
};