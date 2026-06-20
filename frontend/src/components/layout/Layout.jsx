import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import useAuthStore from '../../store/authStore';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };
  return (
    <div className="flex h-screen bg-neutral-100 p-4 gap-4 overflow-hidden">
      <Sidebar onLogout={handleLogout} user={user} />
      <div className="flex-1 flex flex-col rounded-[24px] bg-white border border-neutral-200/40 shadow-lg overflow-hidden h-full">
        <Navbar user={user} />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default Layout;