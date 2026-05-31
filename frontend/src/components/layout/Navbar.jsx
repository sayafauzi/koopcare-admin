import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
const Navbar = ({ user }) => {
  return (
    <header className="bg-white shadow-sm border-b border-neutral-200"><div className="flex justify-between items-center px-6 py-3"><div className="text-neutral-600 text-sm">Selamat datang, Admin</div><div className="flex items-center space-x-3"><span className="text-sm text-neutral-700">{user?.name || 'Admin'}</span><UserCircleIcon className="h-8 w-8 text-neutral-500" /></div></div></header>
  );
};
export default Navbar;