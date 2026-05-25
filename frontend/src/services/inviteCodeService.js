import api from './api.js';

export const fetchInviteCodes = async (page = 1, limit = 10) => {
    const response = await api.get('/admin/invite-codes', { params: { page, limit } });
    return response.data;
};

export const fetchInviteCodeDetail = async (id) => {
    const response = await api.get(`/admin/invite-codes/${id}`);
    return response.data;
};

export const createInviteCode = async (validDays = 30, maxUses = 1) => {
    const response = await api.post('/admin/invite-codes', { validDays, maxUses });
    return response.data;
};

export const revokeInviteCode = async (id) => {
    const response = await api.patch(`/admin/invite-codes/${id}/revoke`);
    return response.data;
};

export const extendInviteCodeValidity = async (id, additionalDays) => {
    const response = await api.patch(`/admin/invite-codes/${id}/extend`, { additionalDays });
    return response.data;
};