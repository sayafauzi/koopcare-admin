import { useState, useEffect, useCallback } from 'react';
import { createTransaction, fetchTodayTransactions } from '../../../services/cashierService';

export const useCashier = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTodayTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchTodayTransactions();
      setTransactions(res.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal memuat transaksi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodayTransactions();
  }, [loadTodayTransactions]);

  const submitTransaction = async (data) => {
    try {
      const res = await createTransaction(data);
      await loadTodayTransactions(); // tunggu refresh selesai
      return { success: true, message: res.message };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Transaksi gagal';
      return { success: false, message: errorMsg };
    }
  };

  return { transactions, loading, error, submitTransaction, refresh: loadTodayTransactions };
};