import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { registerAdmin } from '../../services/authService';
import { 
  EyeIcon, 
  EyeSlashIcon,
  CheckBadgeIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    inviteCode: '',
    fullName: '',
    nik: '',
    phone: '',
    pin: '',
    confirmPin: '',
    agreeTerms: false,
  });
  
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi Dasar
    if (!formData.agreeTerms) {
      setError('Anda harus menyetujui prinsip Ta\'awun dan Syarat & Ketentuan');
      return;
    }
    if (formData.pin !== formData.confirmPin) {
      setError('PIN dan konfirmasi PIN tidak cocok');
      return;
    }
    if (!/^\d{6}$/.test(formData.pin)) {
      setError('PIN harus 6 digit angka');
      return;
    }
    if (!/^\d{16}$/.test(formData.nik)) {
      setError('NIK harus 16 digit angka');
      return;
    }
    if (!formData.inviteCode.trim()) {
      setError('Kode undangan wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const { confirmPin, agreeTerms, ...submitData } = formData;
      const res = await registerAdmin(submitData);
      login(res.user, res.token);
      localStorage.setItem('accessToken', res.token);
      navigate('/');
    } catch (err) {
      console.error('Registrasi error:', err);
      const msg = err.response?.data?.error || err.message || 'Registrasi gagal';
      setError(msg);
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
            <img
              src="/images/koopcare.png"
              alt="KoopCare Logo"
              className="w-16 h-16 object-contain flex-shrink-0"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
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

      {/* Bagian Kanan: Form Register (Putih) */}
      <div className="md:w-1/2 w-full bg-white flex flex-col px-8 md:px-24 lg:px-32 py-12 relative overflow-y-auto max-h-screen">
        <div className="max-w-md w-full mx-auto my-auto">
          
          {/* Tabs Masuk / Daftar */}
          <div className="flex border-b border-gray-200 mb-8 text-center flex-shrink-0">
            <Link to="/login" className="w-1/2 pb-3 hover:bg-gray-50 transition-colors">
              <span className="text-gray-400 font-medium text-lg">Masuk</span>
            </Link>
            <div className="w-1/2 pb-3 border-b-2 border-[#EDBF5D]">
              <span className="text-gray-900 font-semibold text-lg">Daftar</span>
            </div>
          </div>

          {/* Judul Form */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Bergabung dengan KoopCare</h2>
            <p className="text-gray-500 font-light text-sm">
              Buat akun Anda dan mulai perjalanan koperasi Anda.
            </p>
          </div>

          {/* Form Utama */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input: Kode Undangan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Kode Undangan
              </label>
              <input
                type="text"
                name="inviteCode"
                value={formData.inviteCode}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#427B1A] focus:border-[#427B1A] sm:text-sm transition-colors"
                placeholder="Masukkan kode undangan"
                required
              />
            </div>

            {/* Input: Nama Lengkap */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#427B1A] focus:border-[#427B1A] sm:text-sm transition-colors"
                placeholder="cth., Ahmad Fauzi"
                required
              />
            </div>

            {/* Input: NIK */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                NIK (Nomor Induk Kependudukan)
              </label>
              <input
                type="text"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#427B1A] focus:border-[#427B1A] sm:text-sm transition-colors"
                placeholder="16 digit angka"
                required
              />
            </div>

            {/* Input: WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nomor WhatsApp
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#427B1A] focus:border-[#427B1A] sm:text-sm transition-colors"
                placeholder="+62 812-XXXX-XXXX"
                required
              />
            </div>

            {/* Grid untuk PIN & Konfirmasi PIN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Buat PIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Buat PIN Keamanan
                </label>
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    name="pin"
                    value={formData.pin}
                    onChange={handleChange}
                    className="block w-full px-3 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#427B1A] focus:border-[#427B1A] sm:text-sm transition-colors"
                    placeholder="6 digit angka"
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

              {/* Konfirmasi PIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ulangi PIN
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPin ? "text" : "password"}
                    name="confirmPin"
                    value={formData.confirmPin}
                    onChange={handleChange}
                    className="block w-full px-3 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#427B1A] focus:border-[#427B1A] sm:text-sm transition-colors"
                    placeholder="Ulangi PIN"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirmPin ? (
                      <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Checkbox Term & Conditions */}
            <div className="flex items-start gap-3 mt-4 mb-6">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 border-gray-300 rounded text-[#427B1A] focus:ring-[#427B1A]"
                />
              </div>
              <div className="text-sm">
                <label htmlFor="agreeTerms" className="font-light text-gray-500">
                  Saya setuju dengan prinsip Ta'awun (Saling Membantu) dan <span className="text-[#427B1A]">Syarat & Ketentuan KoopCare</span>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-gray-900 bg-[#EDBF5D] hover:bg-[#dcae4c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EDBF5D] transition-colors disabled:opacity-70 mt-2"
            >
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;