import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import EmptyState from '../../components/EmptyState/EmptyState';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import usePageLoading from '../../hooks/usePageLoading';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const Loans = () => {
  const [loans] = useState([]);
  const isLoading = usePageLoading(800);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Loan Management</h1>
        <p className="text-gray-500 text-sm">Persetujuan pembiayaan yang didukung oleh AI Risk Scoring.</p>
      </div>

      {isLoading ? (
        <SkeletonLoader type="table" rows={5} />
      ) : (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loans.length === 0 ? (
          <EmptyState 
            title="Belum Ada Pengajuan Pinjaman" 
            description="Pengajuan pembiayaan akan muncul di sini setelah anggota mengajukan."
            icon="table"
          />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold border-b">ID Pengajuan</th>
                <th className="p-4 font-semibold border-b">Anggota</th>
                <th className="p-4 font-semibold border-b">Nominal</th>
                <th className="p-4 font-semibold border-b">AI Risk Score</th>
                <th className="p-4 font-semibold border-b text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
            <tr className="hover:bg-gray-50 border-b border-gray-50 transition-colors">
              <td className="p-4 font-mono text-xs text-gray-500">#LON-8892</td>
              <td className="p-4 font-semibold text-gray-800">Ahmad Fauzi</td>
              <td className="p-4 font-bold text-gray-800">Rp 3.000.000</td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <span className="font-bold text-green-700">87% (Layak)</span>
                </div>
              </td>
              <td className="p-4 text-right">
                <button className="px-4 py-2 bg-[#748754] text-white rounded-lg text-sm font-semibold hover:bg-[#607144] transition">Approve</button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 border-b border-gray-50 transition-colors">
              <td className="p-4 font-mono text-xs text-gray-500">#LON-8893</td>
              <td className="p-4 font-semibold text-gray-800">Siti Aminah</td>
              <td className="p-4 font-bold text-gray-800">Rp 15.000.000</td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-500" />
                  <span className="font-bold text-red-600">34% (Berisiko)</span>
                </div>
              </td>
              <td className="p-4 text-right">
                <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-50 transition">Review Manual</button>
              </td>
            </tr>
            </tbody>
          </table>
        )}
      </div>
      )}
    </AdminLayout>
  );
};

export default Loans;