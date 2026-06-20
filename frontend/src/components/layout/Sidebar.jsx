import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UserIcon,
  UserGroupIcon,
  WalletIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Halaman Utama', tooltip: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Anggota', tooltip: 'Members', href: '/members', icon: UserGroupIcon },
  { name: 'KYC Verifikasi', tooltip: 'KYC Verification', href: '/kyc', icon: UserIcon },
  { name: 'Manajemen Pinjaman', tooltip: 'Loan Management', href: '/loans', icon: WalletIcon },
  { name: 'Kasir', tooltip: 'Cashier', href: '/cashier', icon: CurrencyDollarIcon },
  { name: 'Buku Besar', tooltip: 'General Ledger', href: '/ledger', icon: DocumentTextIcon },
  { name: 'Kode Undangan', tooltip: 'Invite Codes', href: '/admin/invite-codes', icon: KeyIcon },
];

const Sidebar = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={`text-white flex flex-col shadow-lg border border-white/10 transition-all duration-300 ease-in-out relative flex-shrink-0 rounded-[24px] h-full ${
        isCollapsed
          ? 'w-20 items-center py-6 px-2'
          : 'w-64 py-6 px-4'
      }`}
      style={{
        background: 'radial-gradient(50% 50% at 50% 50%, #427B1A 0%, #386518 100%)',
      }}
    >
      {/* Header & Logo (Toggle Sidebar) */}
      <div
        className={`flex items-center mb-6 cursor-pointer transition-transform w-full ${
          isCollapsed ? 'justify-center' : 'gap-3 px-2'
        }`}
        onClick={toggleSidebar}
        title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
      >
        <img
          src="/images/koopcare.png"
          alt="KoopCare Logo"
          className="w-12 h-12 object-contain flex-shrink-0"
          style={{ filter: 'brightness(0) invert(1)' }}
        />

        {!isCollapsed && (
          <div className="flex flex-col whitespace-nowrap overflow-hidden">
            <h1 className="text-lg font-bold tracking-wide leading-tight text-white">KoopCare</h1>
            <p className="text-[11px] font-semibold text-white/70">Admin Portal</p>
          </div>
        )}
      </div>

      {!isCollapsed && <div className="border-t border-white/20 mb-6 mx-2"></div>}

      {/* Menu Navigasi Utama */}
      <nav className="flex-grow space-y-2 w-full">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group relative flex items-center py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                isCollapsed ? 'justify-center px-0 mx-2' : 'px-4 mx-0 gap-4'
              } ${
                isActive
                  ? 'bg-[#EAAA08] text-[#386518] font-bold shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
            {!isCollapsed && <span className="text-sm truncate">{item.name}</span>}

            {isCollapsed && (
              <div className="absolute left-[4.5rem] px-3 py-1.5 bg-[#F2F2F2] text-gray-800 text-xs font-semibold rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 flex items-center">
                <div className="absolute -left-1 w-2.5 h-2.5 bg-[#F2F2F2] rotate-45 rounded-sm"></div>
                <span className="relative z-10">{item.tooltip || item.name}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Tombol Keluar (Logout) */}
      <div className="w-full mt-auto pt-4">
        <button
          onClick={onLogout}
          className={`group relative flex items-center py-3 w-full rounded-xl transition-all duration-200 cursor-pointer ${
            isCollapsed ? 'justify-center px-0 mx-2' : 'px-4 mx-0 gap-4'
          } hover:bg-white/10 text-white/80 hover:text-white`}
        >
          <ArrowLeftOnRectangleIcon className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
          {!isCollapsed && <span className="text-sm truncate">Keluar</span>}

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