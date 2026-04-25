import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import EmptyState from '../../components/EmptyState/EmptyState';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import usePageLoading from '../../hooks/usePageLoading';
import { Download } from 'lucide-react';

const Ledger = () => {
  const [ledgerData] = useState([]);
  const isLoading = usePageLoading(800);

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">General Ledger</h1>
          <p className="text-gray-500 text-sm">Buku besar rekaman seluruh arus kas koperasi untuk audit.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition shadow-sm">
          <Download size={16} /> Export PDF
        </button>
      </div>

      {isLoading ? (
        <SkeletonLoader type="table" rows={5} />
      ) : (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {ledgerData.length === 0 ? (
          <EmptyState 
            title="Belum Ada Transaksi Ledger" 
            description="Transaksi buku besar akan muncul di sini setelah ada aktivitas keuangan."
            icon="table"
          />
        ) : (
          <table className="w-full text-left font-mono text-sm border-collapse">
            <thead>
              <tr className="bg-gray-800 text-white text-xs uppercase tracking-wider">
                <th className="p-4 border-b border-gray-700">Tanggal</th>
                <th className="p-4 border-b border-gray-700">No. Bukti / Ref</th>
                <th className="p-4 border-b border-gray-700">Keterangan</th>
                <th className="p-4 border-b border-gray-700 text-right">Debit (Masuk)</th>
                <th className="p-4 border-b border-gray-700 text-right">Kredit (Keluar)</th>
                <th className="p-4 border-b border-gray-700 text-right">Saldo Akhir</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 border-b border-gray-100">
                <td className="p-4 text-gray-500">06/04/2026</td>
                <td className="p-4">TRX-001</td>
                <td className="p-4 font-sans text-gray-800">Setoran Simpanan Pokok a.n Agus</td>
                <td className="p-4 text-right text-green-600">500.000</td>
                <td className="p-4 text-right text-gray-400">-</td>
                <td className="p-4 text-right font-bold text-gray-800">1.250.500.000</td>
              </tr>
              <tr className="hover:bg-gray-50 border-b border-gray-100 bg-gray-50/50">
                <td className="p-4 text-gray-500">06/04/2026</td>
                <td className="p-4">LON-8892</td>
                <td className="p-4 font-sans text-gray-800">Pencairan Pembiayaan a.n Budi</td>
                <td className="p-4 text-right text-gray-400">-</td>
                <td className="p-4 text-right text-red-500">3.000.000</td>
                <td className="p-4 text-right font-bold text-gray-800">1.247.500.000</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
      )}
    </AdminLayout>
  );
};

export default Ledger;