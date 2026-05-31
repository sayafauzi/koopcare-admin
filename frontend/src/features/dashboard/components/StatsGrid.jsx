// frontend/src/features/dashboard/components/StatsGrid.jsx
import React from 'react';
import { formatCurrency } from '../../../utils/formatters';
import { BanknotesIcon, CreditCardIcon, UserGroupIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="group bg-white rounded-xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
    <div>
      <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium">{title}</p>
      <p className="text-2xl font-bold text-neutral-800 mt-1 leading-tight">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${color} bg-opacity-90 group-hover:bg-opacity-100 transition-all`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
  </div>
);

const StatsGrid = ({ stats }) => {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard title="Total Aset" value={formatCurrency(stats.totalAssets)} icon={BanknotesIcon} color="bg-green-600" />
      <StatCard title="Pinjaman Berjalan" value={formatCurrency(stats.activeLoans)} icon={CreditCardIcon} color="bg-blue-600" />
      <StatCard title="Anggota Aktif" value={stats.activeMembers} icon={UserGroupIcon} color="bg-primary-700" />
      <StatCard title="Anggota Menunggak" value={stats.delinquentMembers} icon={ExclamationTriangleIcon} color="bg-red-600" />
    </div>
  );
};

export default StatsGrid;