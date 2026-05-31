// frontend/src/services/cashierService.js
import api from './api.js';

export const createTransaction = async (data) => {
  const response = await api.post('/cashier', data);
  return response.data;
};

export const fetchTodayTransactions = async () => {
  const response = await api.get('/cashier/today');
  return response.data;
};