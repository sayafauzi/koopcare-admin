import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import KoopCareSlogan from '../../components/KoopCareSlogan';
import useAuthStore from '../../Store/UseAuthStore';
import useToastStore from '../../Store/UseToastStore';

const RegisterInput = ({ label, name, type = "text", showEye, value, onChange, error, placeholder, disabled }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-dark">{label}</label>
      <div className="relative">
        <input 
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          type={showEye && showPassword ? "text" : type} 
          className={`koopcare-input pr-10 ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`} 
          placeholder={placeholder} 
        />
        {showEye && (
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
    </div>
  );
};

// ... (import tetap sama)

const Register = () => {
  const navigate = useNavigate();
  const toast = useToastStore();
  const { registerUser, error: apiError, isLoading, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    invitationCode: '', fullName: '', nik: '', whatsapp: '', password: '', agreeTerms: false
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    
    // Bersihkan error spesifik field saat user mengetik kembali
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    // Bersihkan error global API jika ada
    if (apiError) clearError();
  };

  const validate = () => {
    const newErrors = {};
    const { invitationCode, fullName, nik, whatsapp, password, agreeTerms } = formData;

    if (!/^[A-Z0-9]+$/.test(invitationCode)) newErrors.invitationCode = "Kode tidak valid";
    if (fullName.length < 3) newErrors.fullName = "Nama minimal 3 huruf";
    if (!/^\d{16}$/.test(nik)) newErrors.nik = "NIK harus 16 digit angka";
    if (!/^(08|\+62)\d{8,12}$/.test(whatsapp)) newErrors.whatsapp = "Format WA tidak valid";
    if (password.length < 8) newErrors.password = "Password minimal 8 karakter";
    if (!agreeTerms) newErrors.agreeTerms = "Persetujuan diperlukan";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading || !validate()) {
      if (!formData.agreeTerms) toast.error("Harap setujui syarat dan ketentuan");
      return;
    }
    const result = await registerUser(formData);

    if (result.success) {
      toast.success('Registrasi berhasil! Mengalihkan ke halaman login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      toast.error(result.message || 'Terjadi kesalahan sistem.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <KoopCareSlogan />

      <div className="md:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        {/* Tambahkan shake animation jika ada error API */}
        <div className={`max-w-md w-full ${apiError ? 'animate-shake' : ''}`}>
          
          <div className="flex border-b mb-8 text-center">
            {['login', 'register'].map((path) => (
              <NavLink 
                key={path} 
                to={`/${path}`} 
                className={({ isActive }) => `pb-3 font-semibold text-lg flex-1 border-b-2 ${isActive ? 'text-primary border-primary' : 'text-gray-400 border-transparent'}`}
              >
                {path === 'login' ? 'Sign In' : 'Register'}
              </NavLink>
            ))}
          </div>

          {/* Alert Error Global */}
          {apiError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={18} /> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <RegisterInput label="Kode Undangan" name="invitationCode" placeholder="KOOP123" value={formData.invitationCode} onChange={handleChange} error={errors.invitationCode} disabled={isLoading} />
            <RegisterInput label="Nama Lengkap" name="fullName" placeholder="Ahmad Fauzi" value={formData.fullName} onChange={handleChange} error={errors.fullName} disabled={isLoading} />
            <RegisterInput label="NIK" name="nik" placeholder="16 Digit" value={formData.nik} onChange={handleChange} error={errors.nik} disabled={isLoading} />
            <RegisterInput label="WhatsApp" name="whatsapp" placeholder="0812..." value={formData.whatsapp} onChange={handleChange} error={errors.whatsapp} disabled={isLoading} />
            <RegisterInput label="Password" name="password" type="password" showEye value={formData.password} onChange={handleChange} error={errors.password} disabled={isLoading} />

            <div className="flex items-start gap-3 text-sm text-gray-600">
              <input 
                type="checkbox" 
                name="agreeTerms" 
                id="agreeTerms"
                checked={formData.agreeTerms} 
                onChange={handleChange} 
                disabled={isLoading}
                className={`mt-1 rounded text-primary focus:ring-primary ${errors.agreeTerms ? 'border-red-500' : 'border-gray-300'}`} 
              />
              <label htmlFor="agreeTerms" className={errors.agreeTerms ? 'text-red-500' : ''}>
                Saya setuju dengan aturan KoopCare
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="koopcare-button-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Memproses...</span>
                </>
              ) : 'Daftar Sekarang'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;