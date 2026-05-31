// frontend/src/services/memberService.js
import api from './api.js';

export const fetchMembers = async (page = 1, search = '', limit = 10, role = '') => {
  const params = { page, search, limit };
  if (role) params.role = role;
  const response = await api.get('/members', { params });
  return response.data;
};

export const fetchMemberDetail = async (id) => {
  const response = await api.get(`/members/${id}`);
  return response.data;
};

export const resetMemberPin = async (id) => {
  const response = await api.post(`/members/${id}/reset-pin`);
  return response.data;
};

export const toggleMemberStatus = async (id) => {
  const response = await api.patch(`/members/${id}/toggle-status`);
  return response.data;
};