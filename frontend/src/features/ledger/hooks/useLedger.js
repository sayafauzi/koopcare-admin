import { useState, useEffect, useCallback } from 'react';
import { fetchLedger, exportLedgerCSV } from '../../../services/ledgerService';

export const useLedger = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ inflow: 0, outflow: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ startDate: '', endDate: '', type: '', memberId: '' });

  const loadLedger = useCallback(async (page = 1, currentFilters = filters) => {
    setLoading(true);
    try {
      const res = await fetchLedger(page, 10, currentFilters);
      setTransactions(res.data);
      setSummary(res.summary);
      setPagination({
        page: res.pagination.page,
        total: res.pagination.total,
        totalPages: res.pagination.totalPages,
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal memuat buku besar');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadLedger(1);
  }, [loadLedger]);

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    loadLedger(1, newFilters);
  };

  const exportCSV = async () => {
    try {
      const blob = await exportLedgerCSV(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ledger_${new Date().toISOString().slice(0,19)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Gagal mengekspor data');
    }
  };

  return { transactions, summary, loading, error, pagination, filters, applyFilters, exportCSV, loadLedger };
};