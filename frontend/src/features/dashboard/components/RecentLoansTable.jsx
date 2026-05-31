// frontend/src/features/dashboard/components/RecentLoansTable.jsx
import React from 'react';
import { formatCurrency, formatDate } from '../../../utils/formatters';

const RecentLoansTable = ({ loans }) => {
  if (!loans.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm">Belum ada pengajuan</p>
        <p className="text-xs mt-1">Pengajuan pinjaman akan muncul di sini</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Anggota</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Tanggal</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">Jumlah</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {loans.map((loan) => (
            <tr key={loan.id} className="hover:bg-neutral-50 transition-colors duration-150">
              <td className="px-4 py-2.5 font-mono text-xs text-neutral-600">{loan.request_number}</td>
              <td className="px-4 py-2.5 font-medium text-neutral-800">{loan.member_name}</td>
              <td className="px-4 py-2.5 text-neutral-600">{formatDate(loan.created_at)}</td>
              <td className="px-4 py-2.5 text-right font-semibold text-neutral-800">{formatCurrency(loan.amount)}</td>
              <td className="px-4 py-2.5">
                <span className={`
                  inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                  ${loan.status === 'APPROVED' ? 'bg-green-100 text-green-800' : ''}
                  ${loan.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
                  ${loan.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                `}>
                  {loan.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentLoansTable;