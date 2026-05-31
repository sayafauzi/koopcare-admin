import api from './api.js';

export const fetchLedger = async (page = 1, limit = 10, filters = {}) => {
  const params = { page, limit, ...filters };
  const response = await api.get('/ledger', { params });
  return response.data;
};

export const exportLedgerCSV = async (filters = {}) => {
  const params = { ...filters };
  const response = await api.get('/ledger/export', { params, responseType: 'blob' });
  return response.data;
};