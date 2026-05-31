import api from './api.js';

export const fetchDashboardData = async (period = 'Minggu ini') => {
  const response = await api.get('/dashboard', { params: { period } });
  return response.data;
};