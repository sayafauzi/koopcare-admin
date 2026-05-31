import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  CalendarIcon, 
  Bars3Icon, 
  ChevronDownIcon,
  ArrowDownTrayIcon 
} from '@heroicons/react/24/outline';

const typeOptions = [
  { value: '', label: 'Semua Transaksi' },
  { value: 'SETORAN_WAJIB', label: 'Setoran Wajib' },
  { value: 'TARIK_TUNAI', label: 'Tarik Tunai' },
  { value: 'BAYAR_ANGSURAN', label: 'Bayar Angsuran' },
  { value: 'TOP_UP', label: 'Top Up' },
  { value: 'PENARIKAN_SALDO', label: 'Penarikan Saldo' },
];

const FilterBar = ({ filters, onApply, onExport }) => {
  const [startDate, setStartDate] = useState(filters?.startDate || '');
  const [endDate, setEndDate] = useState(filters?.endDate || '');
  const [type, setType] = useState(filters?.type || '');
  const [reference, setReference] = useState(filters?.reference || '');

  const handleApply = () => {
    onApply({ startDate, endDate, type, reference, memberId: filters?.memberId });
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row gap-5 items-end">
        
        {/* Kolom 1: Periode (Start Date - End Date) */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Periode
          </label>
          <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2.5 bg-white focus-within:border-[#3B6C19] focus-within:ring-1 focus-within:ring-[#3B6C19] transition-all">
            <CalendarIcon className="w-5 h-5 text-gray-500 flex-shrink-0 mr-2" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-600 text-sm cursor-pointer"
            />
            <span className="text-gray-300 mx-2">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-600 text-sm cursor-pointer"
            />
          </div>
        </div>

        {/* Kolom 2: Kategori */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Kategori
          </label>
          <div className="relative flex items-center border border-gray-300 rounded-xl bg-white focus-within:border-[#3B6C19] focus-within:ring-1 focus-within:ring-[#3B6C19] transition-all">
            <div className="absolute left-3 pointer-events-none">
              <Bars3Icon className="w-5 h-5 text-gray-500" />
            </div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-600 text-sm pl-10 pr-10 py-2.5 appearance-none cursor-pointer"
            >
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="absolute right-3 pointer-events-none">
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Kolom 3: Cari Referensi */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Cari Referensi
          </label>
          <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2.5 bg-white focus-within:border-[#3B6C19] focus-within:ring-1 focus-within:ring-[#3B6C19] transition-all">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 flex-shrink-0 mr-2" />
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Cari ID Referensi..."
              className="w-full bg-transparent outline-none text-gray-600 text-sm"
            />
          </div>
        </div>

        {/* Kolom 4: Aksi (Terapkan Filter & Export) */}
        <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto">
          {/* Tombol Utama (Gradient Linear sesuai desain) */}
          <button
            onClick={handleApply}
            style={{ background: 'linear-gradient(90deg, #3B6C19 0%, #3F7419 100%)' }}
            className="flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity h-[42px] flex items-center justify-center shadow-sm"
          >
            Terapkan Filter
          </button>

          {/* Tombol Export (Dipertahankan sebagai tombol secondary icon agar tidak merusak visual utama) */}
          <button
            onClick={onExport}
            title="Export ke Excel/PDF"
            className="px-3 py-2.5 rounded-xl border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 transition-colors h-[42px] flex items-center justify-center shadow-sm"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default FilterBar;