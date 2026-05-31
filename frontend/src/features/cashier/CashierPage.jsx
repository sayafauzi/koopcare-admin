// frontend/src/features/cashier/CashierPage.jsx
import React, { useState } from 'react';
import { useCashier } from './hooks/useCashier';
import MemberSelector from './components/MemberSelector';
import TransactionForm from './components/TransactionForm';
import TodayTransactions from './components/TodayTransactions';
import { fetchMemberDetail } from '../../services/memberService';
import {
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

const CashierPage = () => {
  const { transactions, loading, submitTransaction } = useCashier();
  const [selectedMember, setSelectedMember] = useState(null);

  const handleSubmit = async (data) => {
    const result = await submitTransaction(data);
    // Jika transaksi berhasil dan ada anggota yang dipilih, refresh data anggotanya
    if (result.success && selectedMember) {
      try {
        const res = await fetchMemberDetail(selectedMember.id);
        setSelectedMember(res.data); // Update dengan saldo terbaru
      } catch (err) {
        console.error('Gagal memperbarui data anggota:', err);
      }
    }
    return result;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-primary-700">Kasir</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Kiri */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-50 border-b border-neutral-200">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold">1</span>
              <span className="text-sm font-medium text-neutral-800">Pilih Anggota</span>
            </div>
            <div className="p-4">
              <MemberSelector onSelect={setSelectedMember} />
            </div>
          </div>

          {selectedMember ? (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-50 border-b border-neutral-200">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold">2</span>
                <span className="text-sm font-medium text-neutral-800">Input Transaksi</span>
              </div>
              <div className="p-4">
                <TransactionForm
                  member={selectedMember}
                  onSubmit={handleSubmit}
                  loading={loading}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 text-center">
              <div className="mx-auto mb-2 text-neutral-300">
                <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-sm text-neutral-500">Belum ada anggota dipilih</p>
            </div>
          )}
        </div>

        {/* Panel Kanan */}
        <div className="rounded-xl border-neutral-200 overflow-hidden flex flex-col">
          <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="h-4 w-4 text-neutral-500" />
                <span className="text-sm font-medium text-neutral-800">Transaksi Hari Ini</span>
              </div>
              <span className="text-xs text-neutral-400">
                {transactions.length} transaksi
              </span>
            </div>
          </div>
          <div className="flex-1">
            <TodayTransactions transactions={transactions} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierPage;