// frontend/src/features/kyc/hooks/useKyc.js
import { useState, useEffect, useCallback } from 'react';
import { fetchKycList, approveKyc, rejectKyc } from '../../../services/kycService';

export const useKyc = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState('PENDING');

  const loadKyc = useCallback(async (page = 1, status = statusFilter) => {
    setLoading(true);
    try {
      const res = await fetchKycList(page, 10, status);
      // Asumsikan response: { success: true, data: [], pagination: { page, total, totalPages } }
      setSubmissions(res.data);
      setPagination({
        page: res.pagination.page,
        total: res.pagination.total,
        totalPages: res.pagination.totalPages,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal memuat data KYC');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  // Reload ketika filter status berubah
  useEffect(() => {
    loadKyc(1);
  }, [loadKyc]);

  const handleApprove = async (id) => {
    try {
      await approveKyc(id);
      await loadKyc(pagination.page); // refresh halaman saat ini
      return true;
    } catch (err) {
      alert(err.response?.data?.error || 'Approve gagal');
      return false;
    }
  };

  const handleReject = async (id, notes) => {
    try {
      await rejectKyc(id, notes);
      await loadKyc(pagination.page);
      return true;
    } catch (err) {
      alert(err.response?.data?.error || 'Reject gagal');
      return false;
    }
  };

  return {
    submissions,
    loading,
    error,
    pagination,
    statusFilter,
    setStatusFilter,
    loadKyc,
    handleApprove,
    handleReject,
  };
};