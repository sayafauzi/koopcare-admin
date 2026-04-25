import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import KoopCareSlogan from '../../components/KoopCareSlogan';
import useAuthStore from '../../Store/UseAuthStore';
import useToastStore from '../../Store/UseToastStore';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, isLoading, error, clearError } = useAuthStore();
  const toast = useToastStore();

  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    if (error) clearError();
  };

  const validate = () => {
    const newErrors = {};
    const { identifier, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const waRegex = /^(08|\+62)[0-9]{8,12}$/;

    if (!identifier) {
      newErrors.identifier = 'Email atau WhatsApp wajib diisi';
    } else if (!emailRegex.test(identifier) && !waRegex.test(identifier.replace(/\s/g, ''))) {
      newErrors.identifier = 'Format Email atau WhatsApp tidak valid';
    }

    if (!password || password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await loginUser(formData);

    if (result.success) {
      navigate('/dashboard');
      return;
    }

    if (result.needsRegister) {
      toast.warning(result.message, {
        label: 'Daftar Sekarang',
        onClick: () => navigate('/register'),
      });
      return;
    }

  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <KoopCareSlogan />

      <div className="md:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className={`max-w-md w-full transition-transform ${error ? 'animate-shake' : ''}`}>

          <div className="flex border-b mb-8">
            {['login', 'register'].map((path) => (
              <NavLink
                key={path}
                to={`/${path}`}
                className={({ isActive }) =>
                  `pb-3 font-semibold text-lg flex-1 text-center border-b-2 ${
                    isActive ? 'text-primary border-primary' : 'text-gray-400 border-transparent'
                  }`
                }
              >
                {path === 'login' ? 'Sign In' : 'Register'}
              </NavLink>
            ))}
          </div>

          {/* Error kredensial salah dari store — hanya muncul jika bukan needsRegister */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-dark">Email atau WhatsApp</label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${errors.identifier ? 'text-red-400' : 'text-gray-400'}`} />
                <input
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  className={`koopcare-input pl-11 ${errors.identifier ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`}
                  placeholder="0812... atau user@mail.com"
                />
              </div>
              {errors.identifier && <p className="text-[11px] text-red-500 font-medium">{errors.identifier}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-dark">Password / PIN</label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`koopcare-input pl-11 pr-10 ${errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-500 font-medium">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="koopcare-button-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <><Loader2 className="animate-spin" size={20} /> Signing In...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
