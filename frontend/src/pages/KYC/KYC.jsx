import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import EmptyState from '../../components/EmptyState/EmptyState';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import usePageLoading from '../../hooks/usePageLoading';
import { Search, Eye, CheckCircle, XCircle } from 'lucide-react';

const KYC = () => {
  const [kycData] = useState([]);
  const isLoading = usePageLoading(800);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">KYC Verification</h1>
        <p className="text-gray-500 text-sm">Tinjau dan verifikasi dokumen identitas anggota baru.</p>
      </div>

      {isLoading ? (
        <SkeletonLoader type="table" rows={5} />
      ) : (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Menunggu Verifikasi</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Cari NIK/Nama..." className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-[#748754] focus:border-[#748754] outline-none" />
          </div>
        </div>
        
        {kycData.length === 0 ? (
          <EmptyState 
            title="Belum Ada Pengajuan KYC" 
            description="Pengajuan verifikasi identitas anggota akan muncul di sini."
            icon="users"
          />
        ) : (
          <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold border-b">Nama Anggota</th>
              <th className="p-4 font-semibold border-b">NIK KTP</th>
              <th className="p-4 font-semibold border-b">Waktu Pengajuan</th>
              <th className="p-4 font-semibold border-b">Status</th>
              <th className="p-4 font-semibold border-b text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[1, 2, 3].map((item) => (
              <tr key={item} className="hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors">
                <td className="p-4 font-semibold text-gray-800">Budi Santoso</td>
                <td className="p-4 text-gray-600">327104290892000{item}</td>
                <td className="p-4 text-gray-500">Hari ini, 09:15</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Pending Review</span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Lihat Dokumen"><Eye size={18} /></button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Setujui"><CheckCircle size={18} /></button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Tolak"><XCircle size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        )}
      </div>
      )}
    </AdminLayout>
  );
};

export default KYC;