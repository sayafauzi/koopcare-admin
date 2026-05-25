import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UserIcon,
  UserGroupIcon, // Ditambahkan kembali
  WalletIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

// Navigasi disesuaikan dengan teks di wireframe dan penambahan menu Anggota
const navigation = [
  { name: 'Halaman Utama', tooltip: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Anggota', tooltip: 'Members', href: '/members', icon: UserGroupIcon }, // Dikembalikan
  { name: 'KYC Verifikasi', tooltip: 'KYC Verification', href: '/kyc', icon: UserIcon },
  { name: 'Manajemen Pinjaman', tooltip: 'Loan Management', href: '/loans', icon: WalletIcon },
  { name: 'Kasir', tooltip: 'Cashier', href: '/cashier', icon: CurrencyDollarIcon },
  { name: 'Buku Besar', tooltip: 'General Ledger', href: '/ledger', icon: DocumentTextIcon },
  { name: 'Kode Undangan', href: '/admin/invite-codes', icon: KeyIcon },
];

const Sidebar = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={`text-white flex flex-col h-screen shadow-2xl transition-all duration-300 ease-in-out relative flex-shrink-0 ${
        isCollapsed ? 'w-20 items-center' : 'w-64 px-4'
      }`}
      // Menerapkan warna radial gradient sesuai panel desain Figma (386518 -> 427B1A)
      style={{
        background: 'radial-gradient(50% 50% at 50% 50%, #427B1A 0%, #386518 100%)',
      }}
    >
      {/* Header & Logo (Bisa diklik untuk expand/collapse) */}
      <div
        className={`flex items-center mt-6 mb-6 cursor-pointer transition-transform ${
          isCollapsed ? 'justify-center' : 'gap-3 px-2'
        }`}
        onClick={toggleSidebar}
        title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
      >
        {/* Logo Kuning/Gold */}
        <div className="w-10 h-10 bg-[#EDBF5D] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Bentuk menyerupai ikon di wireframe */}
            <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            <path d="M12 4v16" />
          </svg>
        </div>

        {!isCollapsed && (
          <div className="flex flex-col whitespace-nowrap overflow-hidden">
            <h1 className="text-xl font-bold tracking-wide leading-tight">KoopCare</h1>
            <p className="text-[11px] font-light text-white/80">Admin Portal</p>
          </div>
        )}
      </div>

      {/* Garis Pemisah (Hanya tampil saat mode diperluas) */}
      {!isCollapsed && <div className="border-t border-white/20 mb-6 mx-2"></div>}

      {/* Menu Navigasi Utama */}
      <nav className="flex-1 space-y-2 w-full">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group relative flex items-center py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                isCollapsed ? 'justify-center px-0 mx-3' : 'px-4 mx-0 gap-4'
              } ${
                isActive
                  ? 'bg-white/20 font-medium shadow-inner'
                  : 'hover:bg-white/10 text-white/90 hover:text-white'
              }`
            }
          >
            <item.icon className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
            {!isCollapsed && <span className="text-sm truncate">{item.name}</span>}

            {/* Tooltip Abu-abu Terang untuk Mode Collapsed (Sesuai Wireframe) */}
            {isCollapsed && (
              <div className="absolute left-[4.5rem] px-3 py-1.5 bg-[#F2F2F2] text-gray-800 text-xs font-semibold rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 flex items-center">
                {/* Segitiga panah kiri */}
                <div className="absolute -left-1 w-2.5 h-2.5 bg-[#F2F2F2] rotate-45 rounded-sm"></div>
                <span className="relative z-10">{item.tooltip}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Tombol Keluar (Logout) diletakkan di paling bawah */}
      <div className="mb-8 w-full mt-auto">
        <button
          onClick={onLogout}
          className={`group relative flex items-center py-3 w-full rounded-xl transition-all duration-200 cursor-pointer ${
            isCollapsed ? 'justify-center px-0 mx-0' : 'px-4 mx-0 gap-4'
          } hover:bg-white/10 text-white/90 hover:text-white`}
        >
          <ArrowLeftOnRectangleIcon className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
          {!isCollapsed && <span className="text-sm truncate">Keluar</span>}

          {/* Tooltip untuk tombol Keluar */}
          {isCollapsed && (
             <div className="absolute left-[4.5rem] px-3 py-1.5 bg-[#F2F2F2] text-gray-800 text-xs font-semibold rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 flex items-center">
              <div className="absolute -left-1 w-2.5 h-2.5 bg-[#F2F2F2] rotate-45 rounded-sm"></div>
              <span className="relative z-10">Keluar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;