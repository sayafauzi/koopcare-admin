import { useState, useEffect, useCallback } from 'react';
import { fetchInviteCodes, createInviteCode, revokeInviteCode, extendInviteCodeValidity } from '../../../services/inviteCodeService';

export const useInviteCodes = () => {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });

    const loadCodes = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await fetchInviteCodes(page, 10);
            setCodes(res.data);
            setPagination({
                page: res.pagination.page,
                total: res.pagination.total,
                totalPages: res.pagination.totalPages,
            });
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal memuat kode undangan');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCodes(1);
    }, [loadCodes]);

    const handleCreate = async (validDays, maxUses) => {
        try {
            await createInviteCode(validDays, maxUses);
            await loadCodes(pagination.page);
            return true;
        } catch (err) {
            alert(err.response?.data?.error || 'Gagal membuat kode');
            return false;
        }
    };

    const handleRevoke = async (id) => {
        if (!window.confirm('Yakin ingin mencabut kode ini? Kode tidak dapat digunakan lagi.')) return false;
        try {
            await revokeInviteCode(id);
            await loadCodes(pagination.page);
            return true;
        } catch (err) {
            alert(err.response?.data?.error || 'Gagal mencabut kode');
            return false;
        }
    };

    const handleExtend = async (id, additionalDays) => {
        if (!window.confirm(`Tambahkan ${additionalDays} hari masa berlaku?`)) return false;
        try {
            await extendInviteCodeValidity(id, additionalDays);
            await loadCodes(pagination.page);
            return true;
        } catch (err) {
            alert(err.response?.data?.error || 'Gagal memperpanjang kode');
            return false;
        }
    };

    return { codes, loading, error, pagination, loadCodes, handleCreate, handleRevoke, handleExtend };
};