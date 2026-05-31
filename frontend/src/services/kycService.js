// frontend/src/services/kycService.js
import api from './api.js';

/**
 * Mendapatkan daftar pengajuan KYC dengan pagination dan filter status
 * @param {number} page - Halaman saat ini
 * @param {number} limit - Jumlah data per halaman
 * @param {string} status - Filter status (PENDING, APPROVED, REJECTED)
 * @returns {Promise} Response API
 */
export const fetchKycList = async (page = 1, limit = 10, status = '') => {
  const params = { page, limit };
  if (status) params.status = status;
  const response = await api.get('/kyc', { params });
  return response.data;
};

/**
 * Mendapatkan detail pengajuan KYC berdasarkan ID
 * @param {number} id - ID pengajuan
 * @returns {Promise} Response API
 */
export const fetchKycDetail = async (id) => {
  const response = await api.get(`/kyc/${id}`);
  return response.data;
};

/**
 * Menyetujui pengajuan KYC
 * @param {number} id - ID pengajuan
 * @returns {Promise} Response API
 */
export const approveKyc = async (id) => {
  const response = await api.post(`/kyc/${id}/approve`);
  return response.data;
};

/**
 * Menolak pengajuan KYC dengan alasan
 * @param {number} id - ID pengajuan
 * @param {string} notes - Alasan penolakan
 * @returns {Promise} Response API
 */
export const rejectKyc = async (id, notes) => {
  const response = await api.post(`/kyc/${id}/reject`, { notes });
  return response.data;
};