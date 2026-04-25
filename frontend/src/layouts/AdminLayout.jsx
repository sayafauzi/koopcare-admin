import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  UserCheck, 
  FileText, 
  Wallet, 
  BookOpen, 
  LogOut, 
  Search, 
  Bell, 
  ChevronDown, 
  Shovel, 
  Loader2 
} from 'lucide-react';
import useAuthStore from '../Store/UseAuthStore';
import useToastStore from '../Store/UseToastStore';

const AdminLayout = ({ children }) => {
  const sidebarBg = "bg-[#748754]";
  const navigate = useNavigate();
  
  const { user, logout } = useAuthStore();
  const toast = useToastStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar dari sistem KoopCare?");
    
    if (confirmLogout) {
      setIsLoggingOut(true);

      setTimeout(() => {
        logout();

        localStorage.removeItem('token'); 
        sessionStorage.clear();

        toast.success('Anda telah logout. Sampai jumpa!');
        navigate('/login', { replace: true });
        setIsLoggingOut(false);
      }, 800); 
    }
  };

  const userName = user?.fullName || "Guest User";
  const userRole = user?.role || "Administrator";

  return (
    <div className="flex h-screen bg-[#F3F6F8] font-sans">
      {/* --- Sidebar --- */}
      <aside className={`w-64 ${sidebarBg} text-white flex flex-col hidden md:flex rounded-r-3xl my-4 ml-4 shadow-xl`}>
        <div className="h-24 flex items-center px-8 pt-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Shovel className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">KoopCare</h2>
              <p className="text-[11px] text-white/70 font-medium tracking-wider">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <Home size={20} /> Dashboard
          </NavLink>
          <NavLink to="/kyc" className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <UserCheck size={20} /> KYC Verification
          </NavLink>
          <NavLink to="/loans" className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <FileText size={20} /> Loan Management
          </NavLink>
          <NavLink to="/cashier" className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <Wallet size={20} /> Cashier
          </NavLink>
          <NavLink to="/ledger" className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
            <BookOpen size={20} /> General Ledger
          </NavLink>
        </nav>

        <div className="p-6 mb-4">
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoggingOut ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut size={20} /> Keluar
              </>
            )}
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-24 flex items-center justify-between px-8 z-10 mt-4">
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Cari data..." 
              className="block w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-[#748754] focus:border-transparent text-sm transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white p-1.5 pr-4 rounded-full shadow-sm border border-gray-100">
            <button className="p-2.5 text-gray-400 hover:text-[#748754] rounded-full transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            <div 
              onClick={() => navigate('/admin/settings?tab=profile')}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 py-1.5 px-2 rounded-full transition-all group"
            >
              {/* Avatar Dinamis Berdasarkan Nama */}
              <div className="w-9 h-9 rounded-full bg-[#748754] text-white flex items-center justify-center font-bold text-sm shadow-inner group-hover:scale-105 transition-transform">
                {getInitials(userName)}
              </div>
              
              <div className="hidden md:block select-none">
                <p className="text-sm font-bold text-gray-800 leading-tight">
                  {userName}
                </p>
                <p className="text-[11px] text-gray-500 capitalize">{userRole}</p>
              </div>
              <ChevronDown size={16} className="text-gray-400 group-hover:text-[#748754] transition-colors" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto px-8 pb-8">
          <div className="max-w-7xl mx-auto mt-4">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;