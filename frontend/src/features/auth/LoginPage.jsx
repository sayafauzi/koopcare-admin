import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { login } from '../../services/authService';
import ForgotPinModal from './components/ForgotPinModal';
import { 
  PhoneIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckBadgeIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !pin) {
      setError('Nomor WhatsApp/Email dan PIN wajib diisi');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await login(identifier, pin);
      storeLogin(res.user, res.token);
      localStorage.setItem('accessToken', res.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal. Periksa kembali data Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans">
      
      {/* Bagian Kiri: Branding & Informasi (Gradient Hijau) */}
      <div 
        className="md:w-1/2 w-full flex flex-col justify-center px-8 md:px-20 lg:px-28 py-12 text-white"
        style={{
          background: 'radial-gradient(50% 50% at 50% 50%, #427B1A 0%, #386518 100%)',
        }}
      >
        <div className="max-w-lg">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-[#EDBF5D] rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <svg
                className="w-7 h-7 text-[#386518]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                <path d="M12 4v16" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold tracking-wide">KoopCare</h1>
          </div>

          <p className="text-lg text-white/90 leading-relaxed mb-12 font-light">
            Memberdayakan Ummah melalui solusi koperasi digital yang transparan dan adil.
          </p>

          {/* List Keunggulan */}
          <div className="space-y-6">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#A5B362] flex items-center justify-center flex-shrink-0">
                <CheckBadgeIcon className="w-6 h-6 text-white" />
              </div>
              <p className="text-white/90 font-light text-base">Layanan keuangan berbasis Syariah</p>
            </div>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#A5B362] flex items-center justify-center flex-shrink-0">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <p className="text-white/90 font-light text-base">Akses aman 24/7 ke akun Anda</p>
            </div>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#A5B362] flex items-center justify-center flex-shrink-0">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <p className="text-white/90 font-light text-base">Bergabung dengan 50.000+ anggota koperasi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Kanan: Form Login (Putih) */}
      <div className="md:w-1/2 w-full bg-white flex flex-col justify-center px-8 md:px-24 lg:px-32 py-12 relative">
        <div className="max-w-md w-full mx-auto">
          
          {/* Tabs Masuk / Daftar */}
          <div className="flex border-b border-gray-200 mb-10 text-center">
            <div className="w-1/2 pb-3 border-b-2 border-[#EDBF5D]">
              <span className="text-gray-900 font-semibold text-lg">Masuk</span>
            </div>
            <Link to="/register" className="w-1/2 pb-3 hover:bg-gray-50 transition-colors">
              <span className="text-gray-400 font-medium text-lg">Daftar</span>
            </Link>
          </div>

          {/* Judul Form */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Selamat Datang Kembali</h2>
            <p className="text-gray-500 font-light text-sm">
              Silakan masukkan detail Anda untuk mengakses akun Anda.
            </p>
          </div>

          {/* Form Utama */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input WhatsApp / Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor WhatsApp atau Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#427B1A] focus:border-[#427B1A] sm:text-sm transition-colors"
                  placeholder="cth. +62 812 3456 7890"
                  required
                />
              </div>
            </div>

            {/* Input Password / PIN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password / PIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#427B1A] focus:border-[#427B1A] sm:text-sm transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPin ? (
                    <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            {/* Lupa Password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sm text-[#427B1A] font-medium hover:underline focus:outline-none"
              >
                Lupa Password?
              </button>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-gray-900 bg-[#EDBF5D] hover:bg-[#dcae4c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EDBF5D] transition-colors disabled:opacity-70"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>

      <ForgotPinModal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} />
    </div>
  );
};

export default LoginPage;