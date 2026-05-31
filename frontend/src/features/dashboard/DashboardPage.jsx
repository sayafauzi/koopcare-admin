import React from 'react';
import { useDashboard } from './hooks/useDashboard';
import StatsGrid from './components/StatsGrid';
import RecentLoansTable from './components/RecentLoansTable';
import ActivityChart from './components/ActivityChart';
import InviteCodeWidget from './components/InviteCodeWidget'; // <--- import widget dinamis
import Spinner from '../../components/ui/Spinner';

const DashboardPage = () => {
  const { stats, recentLoans, activity, loading, error } = useDashboard();

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  if (error) return <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary-700">Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Ringkasan data koperasi</p>
        </div>
      </div>

      {/* Statistik */}
      <StatsGrid stats={stats} />

      {/* Grafik Aktivitas & Kode Undangan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
          <h3 className="text-md font-semibold text-neutral-800 mb-3">Aktivitas 7 Hari Terakhir</h3>
          <ActivityChart
            labels={activity.labels}
            inflows={activity.inflows}
            outflows={activity.outflows}
          />
        </div>
        <div className="lg:col-span-1">
          <InviteCodeWidget />   {/* Ganti widget statis di sini */}
        </div>
      </div>

      {/* Tabel Pengajuan Terbaru */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-semibold text-neutral-800">Aktivitas Pengajuan</h3>
          <a href="/loans" className="text-xs text-primary-600 hover:underline">Lihat semua</a>
        </div>
        <RecentLoansTable loans={recentLoans} />
      </div>
    </div>
  );
};

export default DashboardPage;