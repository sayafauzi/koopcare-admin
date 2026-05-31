import { useState, useEffect, useCallback } from 'react';
import { fetchDashboardData } from '../../../services/dashboardService';

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentLoans, setRecentLoans] = useState([]);
  const [activity, setActivity] = useState({ labels: [], inflows: [], outflows: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('Minggu ini');

  const loadDashboard = useCallback(async (currentPeriod) => {
    setLoading(true);
    try {
      const res = await fetchDashboardData(currentPeriod);
      setStats(res.data.stats);
      setRecentLoans(res.data.recentLoans);
      setActivity(res.data.activity);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal memuat dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard(period);
  }, [period, loadDashboard]);

  const changePeriod = (newPeriod) => setPeriod(newPeriod);

  return { stats, recentLoans, activity, loading, error, period, changePeriod };
};