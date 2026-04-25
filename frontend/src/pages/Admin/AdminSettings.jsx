import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { User, Lock, Settings, Save, Camera, Globe, ArrowLeft, Loader2 } from 'lucide-react';
import useAuthStore from '../../Store/UseAuthStore';
import useToastStore from '../../Store/UseToastStore';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import usePageLoading from '../../hooks/usePageLoading';

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
};

const INPUT_CLS = 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#748754] outline-none text-sm transition-all';
const INPUT_DISABLED_CLS = 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 text-sm cursor-not-allowed';

const makeHandleChange = (setter) => (e) => {
  const { name, value } = e.target;
  setter((prev) => ({ ...prev, [name]: value }));
};

const useAsyncAction = () => {
  const [isSaving, setIsSaving] = useState(false);

  const run = async (action) => {
    setIsSaving(true);
    try {
      await action();
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, run };
};

const FormField = ({ label, name, type = 'text', value, onChange, placeholder, disabled = false, isSaving = false }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled || isSaving}
      className={disabled ? INPUT_DISABLED_CLS : INPUT_CLS}
    />
  </div>
);

const ToggleItem = ({ title, enabled, setEnabled }) => (
  <div className="flex items-center justify-between p-2">
    <p className="text-sm font-bold text-gray-800">{title}</p>
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${enabled ? 'bg-[#748754]' : 'bg-gray-200'}`}
    >
      <div className={`absolute w-4 h-4 bg-white rounded-full transition-transform duration-200 shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

const TABS = [
  { id: 'profile',     label: 'Account Profile',      icon: <User size={18} /> },
  { id: 'security',    label: 'Security',              icon: <Lock size={18} /> },
  { id: 'preferences', label: 'Dashboard Preferences', icon: <Settings size={18} /> },
];

const AdminSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'profile';
  const isLoading = usePageLoading(800);

  if (isLoading) {
    return (
      <div className="p-8">
        <SkeletonLoader type="card" rows={1} />
        <div className="mt-6">
          <SkeletonLoader type="form" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-500">
      <aside className="w-full md:w-64 space-y-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#748754] mb-6 transition-colors font-medium group"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:bg-gray-50">
            <ArrowLeft size={16} />
          </div>
          Dashboard
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6 px-2">Settings</h1>

        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSearchParams({ tab: tab.id })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[#748754] text-white shadow-md shadow-[#748754]/20'
                : 'text-gray-500 hover:bg-white hover:text-[#748754]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </aside>

      <div className="flex-1 space-y-6">
        {activeTab === 'profile'     && <ProfileSection />}
        {activeTab === 'security'    && <SecuritySection />}
        {activeTab === 'preferences' && <PreferencesSection />}
      </div>
    </div>
  );
};

const PROFILE_FIELDS = [
  { label: 'Nama Lengkap', name: 'fullName', type: 'text'  },
  { label: 'Email Address', name: 'email',   type: 'email' },
  { label: 'NIK',           name: 'nik',     type: 'text'  },
  { label: 'WhatsApp',      name: 'whatsapp',type: 'text'  },
  { label: 'Role',          name: 'role',    type: 'text', disabled: true },
];

const ProfileSection = () => {
  const { user, updateUser } = useAuthStore();
  const toast = useToastStore();
  const { isSaving, run } = useAsyncAction();

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email:    user?.email    || '',
    nik:      user?.nik      || '',
    whatsapp: user?.whatsapp || '',
    role:     user?.role     || 'Administrator',
  });

  const handleChange = makeHandleChange(setForm);

  const handleSave = () => run(async () => {
    await new Promise((res) => setTimeout(res, 1000));
    updateUser({ fullName: form.fullName, email: form.email, nik: form.nik, whatsapp: form.whatsapp });
    toast.success('Profil berhasil diperbarui!');
  });

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 pb-8 border-b border-gray-100">
        <div className="relative group">
          <div className="w-24 h-24 rounded-3xl bg-[#748754] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {getInitials(form.fullName)}
          </div>
          <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-md border border-gray-100 text-[#748754] hover:bg-gray-50">
            <Camera size={18} />
          </button>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{form.fullName || 'Guest User'}</h3>
          <p className="text-gray-500 text-sm mb-3">
            {form.role} • NIK: <span className="font-mono font-semibold text-gray-700">{form.nik || '—'}</span>
          </p>
          <button className="px-4 py-2 text-xs font-semibold text-[#748754] bg-[#748754]/10 rounded-lg hover:bg-[#748754]/20 transition-all">
            Change Photo
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROFILE_FIELDS.map((f) => (
          <FormField key={f.name} {...f} value={form[f.name]} onChange={handleChange} isSaving={isSaving} />
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#748754] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#5f6e44] transition-all shadow-lg shadow-[#748754]/20 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? <><Loader2 className="animate-spin" size={18} /> Menyimpan...</> : <><Save size={18} /> Update Profile</>}
        </button>
      </div>
    </div>
  );
};

const PASS_FIELDS = [
  { label: 'Password Saat Ini',   name: 'current', placeholder: '••••••••' },
  { label: 'Password Baru',       name: 'newPass', placeholder: 'Min. 8 karakter' },
  { label: 'Konfirmasi Password', name: 'confirm', placeholder: '••••••••' },
];

const SecuritySection = () => {
  const { updateUser, registeredUser } = useAuthStore();
  const toast = useToastStore();
  const { isSaving, run } = useAsyncAction();
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });

  const handleChange = makeHandleChange(setForm);

  const handleSave = () => {
    if (form.current !== registeredUser?.password) return toast.error('Password saat ini tidak sesuai.');
    if (form.newPass.length < 8)                   return toast.error('Password baru minimal 8 karakter.');
    if (form.newPass !== form.confirm)              return toast.error('Konfirmasi password tidak cocok.');

    run(async () => {
      await new Promise((res) => setTimeout(res, 1000));
      updateUser({ password: form.newPass });
      setForm({ current: '', newPass: '', confirm: '' });
      toast.success('Password berhasil diubah!');
    });
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-300">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
        <p className="text-sm text-gray-500">Perbarui password secara berkala untuk menjaga keamanan akun.</p>
      </div>
      <div className="max-w-md space-y-5">
        {PASS_FIELDS.map((f) => (
          <FormField key={f.name} {...f} type="password" value={form[f.name]} onChange={handleChange} isSaving={isSaving} />
        ))}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#748754] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#5f6e44] transition-all shadow-lg shadow-[#748754]/20 disabled:opacity-70"
        >
          {isSaving ? <><Loader2 className="animate-spin" size={18} /> Menyimpan...</> : <><Lock size={18} /> Save Password</>}
        </button>
      </div>
    </div>
  );
};

const PreferencesSection = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCompact, setIsCompact]   = useState(true);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-in slide-in-from-right-4 duration-300">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800">Language & Display</h3>
      </div>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-4">
            <Globe className="text-[#748754]" size={24} />
            <p className="font-bold text-gray-800 text-sm">System Language</p>
          </div>
          <select className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-[#748754] outline-none">
            <option>Bahasa Indonesia</option>
            <option>English (US)</option>
          </select>
        </div>
        <ToggleItem title="Compact View" enabled={isCompact}  setEnabled={setIsCompact} />
        <ToggleItem title="Dark Mode"    enabled={isDarkMode}  setEnabled={setIsDarkMode} />
      </div>
    </div>
  );
};

export default AdminSettings;
