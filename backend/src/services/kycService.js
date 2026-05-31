import * as kycModel from '../models/KycModel.js';
import pool from '../config/database.js';

export const getAllKyc = async (page, limit, status) => {
  const offset = (page - 1) * limit;
  return await kycModel.findAll(limit, offset, status);
};

export const getKycDetail = async (id) => {
  const submission = await kycModel.findById(id);
  if (!submission) throw new Error('Pengajuan KYC tidak ditemukan');
  return submission;
};

export const approveKycSubmission = async (id, reviewerId) => {
  const submission = await kycModel.findById(id);
  if (!submission) throw new Error('Pengajuan tidak ditemukan');
  
  const existing = await kycModel.findExistingApprovedByNik(submission.nik, id);
  if (existing) throw new Error('NIK sudah terverifikasi untuk anggota lain');
  
  await kycModel.updateStatus(id, 'APPROVED', reviewerId, null);
  // Update status member menjadi ACTIVE
  await pool.query('UPDATE members SET status = "ACTIVE" WHERE id = ?', [submission.member_id]);
  return true;
};

export const rejectKycSubmission = async (id, reviewerId, notes) => {
  const submission = await kycModel.findById(id);
  if (!submission) throw new Error('Pengajuan tidak ditemukan');
  
  await kycModel.updateStatus(id, 'REJECTED', reviewerId, notes || 'Ditolak oleh admin');
  return true;
};