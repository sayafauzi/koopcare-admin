import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import usePageLoading from '../../hooks/usePageLoading';
import { 
  Users, 
  UserPlus, 
  FileCheck, 
  TrendingUp, 
  Copy, 
  Eye, 
  Edit2, 
  Trash2, 
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const StatCard = ({ label, value, subtext, subtextColor = "text-green-500", highlightValue = false }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
    <h3 className={`text-3xl font-bold ${highlightValue ? 'text-red-500' : 'text-gray-900'}`}>
      {value}
    </h3>
    <p className={`text-xs mt-2 font-medium ${subtextColor}`}>{subtext}</p>
  </div>
);

const QuickActionButton = ({ icon: Icon, label, count }) => (
  <button className="flex items-center gap-4 bg-white/10 hover:bg-white/20 transition-all p-4 rounded-xl flex-1 text-left min-w-[200px]">
    <div className="bg-white/20 p-2 rounded-lg relative">
      <Icon className="text-white" size={20} />
      {count && (
        <span className="absolute -top-2 -right-2 bg-white text-[#3D5A2D] text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
    <span className="text-white font-medium text-sm">{label}</span>
  </button>
);

const Dashboard = () => {
  const isLoading = usePageLoading(800);

  return (
    <AdminLayout>
      <div className="bg-[#F8F9FA] min-h-screen p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Ringkasan data koperasi</p>
        </div>

        {isLoading ? (
          <SkeletonLoader type="card" rows={4} />
        ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            label="Total Aset Koperasi" 
            value="Rp 4,2M" 
            subtext="↗ 14.2% Bulan ini" 
          />
          <StatCard 
            label="Pinjaman Berjalan" 
            value="Rp 1,5M" 
            subtext="32 Pengajuan aktif" 
            subtextColor="text-gray-500"
          />
          <StatCard 
            label="Total Anggota Aktif" 
            value="318" 
            subtext="12 Baru Bulan Ini" 
            subtextColor="text-gray-500"
          />
          <StatCard 
            label="Anggota Menunggak" 
            value="7" 
            subtext="Total Rp 27.5M" 
            subtextColor="text-red-500"
            highlightValue={true}
          />
        </div>

        <div className="bg-[#3D5A2D] rounded-2xl p-6 mb-8">
          <p className="text-white/80 text-xs font-bold uppercase mb-4 tracking-widest">Tindakan Cepat</p>
          <div className="flex flex-wrap gap-4">
            <QuickActionButton icon={FileCheck} label="Verifikasi KYC" count="7" />
            <QuickActionButton icon={TrendingUp} label="Proses Pinjaman" count="12" />
            <QuickActionButton icon={UserPlus} label="Tambah Anggota" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-bold text-gray-900">Aktivitas Pengguna</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-blue-600">5.000,00</span>
                  <span className="text-xs text-gray-400 font-medium">50 Orders</span>
                </div>
              </div>
              <select className="text-xs font-semibold bg-gray-50 border-none rounded-lg p-2 focus:ring-0">
                <option>Minggu ini</option>
              </select>
            </div>
            <div className="h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm italic">[ Recharts: LineChart Component Placeholder ]</p>
            </div>
          </div>

          {}
          <div className="lg:col-span-5 bg-[#1B3014] p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/10 p-2 rounded-lg">
                <Share2 size={20} />
              </div>
              <h4 className="font-bold">Kode Undangan Anggota</h4>
            </div>
            <p className="text-white/60 text-xs mb-6">Bagikan kode ini untuk mendaftarkan anggota baru</p>
            
            <div className="bg-white rounded-xl p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Kode Undangan Aktif</p>
                <p className="text-gray-900 font-mono font-bold text-lg">KOD-A61wjjoSj</p>
              </div>
              <button className="bg-[#3D5A2D] p-2 rounded-lg hover:bg-[#2D4522] transition-colors">
                <Copy size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div className="bg-white/5 rounded-xl py-3 border border-white/10">
                <p className="text-xl font-bold">5</p>
                <p className="text-[10px] text-white/40 uppercase">Diundang</p>
              </div>
              <div className="bg-white/5 rounded-xl py-3 border border-white/10">
                <p className="text-xl font-bold">10</p>
                <p className="text-[10px] text-white/40 uppercase">Terdaftar</p>
              </div>
              <div className="bg-white/5 rounded-xl py-3 border border-white/10">
                <p className="text-xl font-bold">10%</p>
                <p className="text-[10px] text-white/40 uppercase">Konversi</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-white text-[#1B3014] font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors">
                Salin & Bagikan Kode
              </button>
              <button className="w-full bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors">
                Buat Kode Baru
              </button>
            </div>
            <p className="text-[10px] text-center text-white/30 mt-4 italic">Kode ini berlaku hingga 20 hari ke depan</p>
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900">Aktivitas Pengajuan</h2>
            <p className="text-xs text-gray-400">Recent member loan requests and their approval status.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Member Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">#021</td>
                  <td className="px-6 py-4 font-bold text-gray-700">Ahmad Fauzi</td>
                  <td className="px-6 py-4 text-sm text-gray-500">20 - 02 - 2026</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">Rp 1.500.000</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-[10px] font-bold uppercase">Rejected</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-3">
                      <button className="text-gray-400 hover:text-gray-600"><Eye size={18} /></button>
                      <button className="text-yellow-500 hover:text-yellow-600"><Edit2 size={18} /></button>
                      <div className="h-4 w-[1px] bg-gray-200"></div>
                      <button className="text-red-500 hover:text-red-600"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium">Showing <span className="text-gray-900">0</span> of <span className="text-gray-900">247</span> applications</p>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-400">
                <ChevronLeft size={16} />
              </button>
              <button className="h-8 w-8 rounded-lg bg-[#3D5A2D] text-white text-xs font-bold">1</button>
              <button className="h-8 w-8 rounded-lg bg-white border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50">2</button>
              <button className="h-8 w-8 rounded-lg bg-white border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50">3</button>
              <span className="text-gray-400 px-1">...</span>
              <button className="h-8 w-8 rounded-lg bg-white border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50">31</button>
              <button className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-600">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;