import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import EmptyState from '../../components/EmptyState/EmptyState';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import usePageLoading from '../../hooks/usePageLoading';

const Cashier = () => {
  const [transactions] = useState([]);
  const isLoading = usePageLoading(800);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Cashier (Teller)</h1>
        <p className="text-gray-500 text-sm">Pencatatan setoran dan penarikan tunai secara manual di kantor cabang.</p>
      </div>

      {isLoading ? (
        <SkeletonLoader type="form" />
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Input Transaksi Baru</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Anggota / NIK</label>
              <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-[#748754] outline-none" placeholder="Cari anggota..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Transaksi</label>
              <select className="w-full px-4 py-2 border rounded-lg focus:ring-[#748754] outline-none bg-white">
                <option>Setoran Simpanan (Kredit)</option>
                <option>Penarikan Tunai (Debit)</option>
                <option>Pelunasan Cicilan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah (Rp)</label>
              <input type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-[#748754] outline-none" placeholder="0" />
            </div>
            <button type="button" className="w-full bg-[#E5C07A] text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-500 transition mt-4">
              Proses Transaksi
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Riwayat Transaksi Hari Ini</h2>
          </div>
          {transactions.length === 0 ? (
            <EmptyState 
              title="Belum Ada Transaksi" 
              description="Transaksi kasir akan muncul di sini setelah Anda memproses setoran atau penarikan."
              icon="transaction"
            />
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="p-4 border-b">Waktu</th>
                  <th className="p-4 border-b">Anggota</th>
                  <th className="p-4 border-b">Jenis</th>
                  <th className="p-4 border-b text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="p-4 border-b text-gray-500">10:24 WIB</td>
                  <td className="p-4 border-b font-semibold text-gray-800">Agus Setiawan</td>
                  <td className="p-4 border-b"><span className="text-green-600 font-medium">Setoran</span></td>
                  <td className="p-4 border-b text-right font-bold">Rp 500.000</td>
                </tr>
                <tr>
                  <td className="p-4 border-b text-gray-500">09:10 WIB</td>
                  <td className="p-4 border-b font-semibold text-gray-800">Budi Santoso</td>
                  <td className="p-4 border-b"><span className="text-red-600 font-medium">Penarikan</span></td>
                  <td className="p-4 border-b text-right font-bold">Rp 200.000</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
      )}
    </AdminLayout>
  );
};

export default Cashier;