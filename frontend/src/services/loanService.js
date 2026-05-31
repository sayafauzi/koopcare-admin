// frontend/src/services/loanService.js
import api from './api.js';

export const fetchLoans = async (page = 1, limit = 10, status = 'PENDING') => {
  const response = await api.get('/loans', { params: { page, limit, status } });
  return response.data;
};

export const fetchLoanDetail = async (id) => {
  const response = await api.get(`/loans/${id}`);
  return response.data;
};

export const approveLoan = async (id, approvedAmount, approvedTenor) => {
  const response = await api.post(`/loans/${id}/approve`, { approvedAmount, approvedTenor });
  return response.data;
};

export const rejectLoan = async (id, reason) => {
  const response = await api.post(`/loans/${id}/reject`, { reason });
  return response.data;
};