import { useState, useEffect, useCallback } from 'react';
import { fetchLoans, approveLoan, rejectLoan } from '../../../services/loanService';

export const useLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState('PENDING');

  const loadLoans = useCallback(async (page = 1, status = statusFilter) => {
    setLoading(true);
    try {
      const res = await fetchLoans(page, 10, status);
      setLoans(res.data);
      setPagination({
        page: res.pagination.page,
        total: res.pagination.total,
        totalPages: res.pagination.totalPages,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal memuat data pinjaman');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadLoans(1);
  }, [loadLoans]);

  const handleApprove = async (id, approvedAmount, approvedTenor) => {
    try {
      await approveLoan(id, approvedAmount, approvedTenor);
      await loadLoans(pagination.page);
      return true;
    } catch (err) {
      alert(err.response?.data?.error || 'Approve gagal');
      return false;
    }
  };

  const handleReject = async (id, reason) => {
    try {
      await rejectLoan(id, reason);
      await loadLoans(pagination.page);
      return true;
    } catch (err) {
      alert(err.response?.data?.error || 'Reject gagal');
      return false;
    }
  };

  return { loans, loading, error, pagination, statusFilter, setStatusFilter, loadLoans, handleApprove, handleReject };
};