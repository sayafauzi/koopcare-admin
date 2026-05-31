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
    <div className="flex h-screen bg-neutral-100"><Sidebar onLogout={handleLogout} /><div className="flex-1 flex flex-col overflow-hidden"><Navbar user={user} /><main className="flex-1 overflow-y-auto p-6"><Outlet /></main></div></div>
  );
};
export default Layout;