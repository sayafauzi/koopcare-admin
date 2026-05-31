import api from './api.js';

export const registerAdmin = async (data) => {
  const response = await api.post('/auth/register-admin', data);
  return response.data;
};

export const login = async (identifier, pin) => {
  const response = await api.post('/auth/login', { identifier, pin });
  return response.data;
};

export const forgotPin = async (identifier) => {
  const response = await api.post('/auth/forgot-pin', { identifier });
  return response.data;
};

export const resetPin = async (identifier, otp, newPin) => {
  const response = await api.post('/auth/reset-pin', { identifier, otp, newPin });
  return response.data;
};