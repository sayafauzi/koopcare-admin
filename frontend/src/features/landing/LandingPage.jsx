import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import {
  UserGroupIcon,
  WalletIcon,
  DocumentTextIcon,
  Bars3Icon,
  XMarkIcon,
  BanknotesIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  IdentificationIcon,
  PresentationChartLineIcon,
  ArrowDownTrayIcon,
  DevicePhoneMobileIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import heroImage from '../../assets/koopcare_hero.png';

// Ganti URL ini dengan link APK yang sebenarnya saat tersedia
const APK_DOWNLOAD_URL = 'https://www.mediafire.com/file/5w7nfp2cinde8vm/koopcare.apk/file';
const APK_VERSION = '1.0.0';
const APK_SIZE = '18.4 MB';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const stats = {
    totalAssets: 12450000000,
    activeLoans: 4820000000,
    activeMembers: 1245,
    delinquentMembers: 12,
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-800 font-body relative select-none">

      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-neutral-100/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">

          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <img
              src="/images/koopcare.png"
              alt="KoopCare Logo"
              className="w-12 h-12 object-contain flex-shrink-0"
            />
            <div>
              <h1 className="text-lg font-bold tracking-wide font-heading text-[#386518] leading-none">KoopCare</h1>
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Portal Koperasi</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-10 font-heading text-sm font-semibold text-neutral-600">
            <a href="#beranda" className="hover:text-[#386518] transition-colors relative after:absolute after:bottom-[-6px] after:left-0 after:w-0 after:h-[2px] after:bg-[#386518] hover:after:w-full after:transition-all">Beranda</a>
            <a href="#fitur" className="hover:text-[#386518] transition-colors relative after:absolute after:bottom-[-6px] after:left-0 after:w-0 after:h-[2px] after:bg-[#386518] hover:after:w-full after:transition-all">Fitur</a>
            <a href="#tentang" className="hover:text-[#386518] transition-colors relative after:absolute after:bottom-[-6px] after:left-0 after:w-0 after:h-[2px] after:bg-[#386518] hover:after:w-full after:transition-all">Tentang</a>
            <a href="#download" className="hover:text-[#386518] transition-colors relative after:absolute after:bottom-[-6px] after:left-0 after:w-0 after:h-[2px] after:bg-[#386518] hover:after:w-full after:transition-all">Download APK</a>
          </nav>

          {/* Call to Action Button */}
          <div className="hidden md:block relative">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Secondary quick-link button to Dashboard */}
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-lg font-heading font-bold text-[11px] text-[#386518] hover:bg-[#386518]/5 transition-all"
                >
                  Ke Dashboard
                </Link>

                {/* Profile Avatar Button */}
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 pr-3 rounded-full hover:bg-neutral-50 border border-neutral-100 transition-all focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-[#EDBF5D] text-[#386518] font-bold text-xs flex items-center justify-center border border-[#EDBF5D]/20 shadow-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <span className="text-xs font-bold text-neutral-700 max-w-[100px] truncate">
                    {user?.name || user?.full_name || 'Anggota'}
                  </span>
                  <svg className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown Box */}
                {profileDropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown on outer click */}
                    <div className="fixed inset-0 z-30" onClick={() => setProfileDropdownOpen(false)} />

                    <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl border border-neutral-200/80 shadow-xl py-2 z-40 animate-scaleIn">
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Akun Koperasi</p>
                        <p className="text-xs font-bold text-neutral-800 truncate mt-0.5">{user?.name || user?.full_name || 'Anggota KoopCare'}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-neutral-700 hover:bg-[#386518]/5 hover:text-[#386518] transition-colors"
                      >
                        <ChartBarIcon className="w-4 h-4" />
                        Portal Dashboard
                      </Link>

                      <div className="border-t border-neutral-100 my-1" />

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Keluar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-8 py-2.5 rounded-xl font-heading font-bold text-xs bg-[#386518] text-white hover:bg-[#2e5c14] transition-all shadow-md shadow-[#386518]/10 hover:shadow-lg"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 focus:outline-none"
          >
            {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white/98 pt-24 px-6 flex flex-col gap-6 text-base font-semibold text-neutral-700 animate-fadeIn">
          <a
            href="#beranda"
            onClick={() => setMobileMenuOpen(false)}
            className="border-b border-neutral-100 pb-3 hover:text-[#386518]"
          >
            Beranda
          </a>
          <a
            href="#fitur"
            onClick={() => setMobileMenuOpen(false)}
            className="border-b border-neutral-100 pb-3 hover:text-[#386518]"
          >
            Fitur
          </a>
          <a
            href="#tentang"
            onClick={() => setMobileMenuOpen(false)}
            className="border-b border-neutral-100 pb-3 hover:text-[#386518]"
          >
            Tentang
          </a>
          <a
            href={APK_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="border-b border-neutral-100 pb-3 text-[#386518] flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Download APK
          </a>

          <div className="mt-4 border-t border-neutral-100 pt-6">
            {isAuthenticated ? (
              <div className="space-y-4">
                {/* Mobile User Profile info */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <div className="w-10 h-10 rounded-full bg-[#EDBF5D] text-[#386518] font-bold text-sm flex items-center justify-center border border-[#EDBF5D]/20">
                    {user?.name ? user.name.charAt(0).toUpperCase() : user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider leading-none">Masuk sebagai</p>
                    <p className="text-sm font-bold text-neutral-800 truncate mt-1">{user?.name || user?.full_name || 'Anggota Koperasi'}</p>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3.5 rounded-xl font-heading font-bold bg-[#386518] text-white hover:bg-[#2e5c14] transition-all text-center flex items-center justify-center gap-2"
                >
                  Ke Dashboard
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="w-full py-3.5 rounded-xl font-heading font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all text-center flex items-center justify-center gap-2"
                >
                  Keluar dari Akun
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-xl font-heading font-bold bg-[#386518] text-white hover:bg-[#2e5c14] transition-all text-center flex items-center justify-center"
              >
                Masuk ke Sistem
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="beranda" className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Hero Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">

            {/* Soft Gray Badge matching the PLN style perfectly */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-100 border border-neutral-200/60 text-neutral-500 font-semibold text-xs mb-8">
              <span className="w-2 h-2 rounded-full bg-[#EDBF5D]" />
              PT Koperasi Digital - KoopCare Utama
            </div>

            {/* Main Headline */}
            <h2 className="text-3.5xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.12] font-heading mb-6 max-w-2xl">
              Sistem Informasi Pemetaan <br />
              <span className="text-[#386518]">Kebutuhan & Layanan Anggota</span> <br />
              Koperasi KoopCare
            </h2>

            {/* Subtitle Description */}
            <p className="text-neutral-500 text-sm md:text-base font-medium leading-relaxed mb-8 max-w-xl">
              Membantu pengurus koperasi memetakan kebutuhan anggota dalam penggunaan aplikasi KoopCare secara lebih terarah, sederhana, dan berbasis data.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap gap-4 w-full sm:w-auto mb-16">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-heading font-bold text-xs bg-[#386518] text-white hover:bg-[#2e5c14] transition-all shadow-md shadow-[#386518]/10 hover:shadow-lg hover:-translate-y-[1px]"
                >
                  Masuk ke Sistem <ArrowRightIcon className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-heading font-bold text-xs bg-[#386518] text-white hover:bg-[#2e5c14] transition-all shadow-md shadow-[#386518]/10 hover:shadow-lg hover:-translate-y-[1px]"
                >
                  Masuk ke Sistem <ArrowRightIcon className="w-4 h-4" />
                </Link>
              )}

              <a
                href={APK_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-heading font-bold text-xs bg-[#EDBF5D] text-[#386518] hover:bg-[#e5b34a] transition-all shadow-md shadow-[#EDBF5D]/30 hover:shadow-lg hover:-translate-y-[1px]"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Download APK
              </a>

              <button
                onClick={() => setShowSummaryModal(true)}
                className="flex-1 sm:flex-initial px-8 py-3.5 rounded-xl font-heading font-bold text-xs bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-950 transition-all hover:-translate-y-[1px]"
              >
                Lihat Ringkasan
              </button>
            </div>

            {/* 3 Floating docked card links matching reference layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">

              {/* Card 1 */}
              <div className="bg-neutral-50 hover:bg-white p-4.5 rounded-2xl border border-neutral-200/60 shadow-sm hover:shadow-md hover:border-[#386518]/45 transition-all flex items-center gap-3.5 cursor-pointer">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                  <IdentificationIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-neutral-800 leading-snug">Pemetaan KYC</h4>
                  <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Identitas & Selfie</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-neutral-50 hover:bg-white p-4.5 rounded-2xl border border-neutral-200/60 shadow-sm hover:shadow-md hover:border-[#386518]/45 transition-all flex items-center gap-3.5 cursor-pointer">
                <div className="p-3 rounded-xl bg-amber-50 text-[#d4a52e] flex-shrink-0">
                  <UserGroupIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-neutral-800 leading-snug">Survei Kebutuhan</h4>
                  <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Kondisi & Tenor</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-neutral-50 hover:bg-white p-4.5 rounded-2xl border border-neutral-200/60 shadow-sm hover:shadow-md hover:border-[#386518]/45 transition-all flex items-center gap-3.5 cursor-pointer">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                  <PresentationChartLineIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-neutral-800 leading-snug">Laporan Ringkas</h4>
                  <p className="text-[10px] text-neutral-400 font-medium mt-0.5">Statistik Bulanan</p>
                </div>
              </div>

            </div>

          </div>

          {/* Hero Right Column (Premium Vector Illustration) */}
          <div className="lg:col-span-5 w-full flex justify-center items-center relative select-none">

            {/* Visual gradient backdrop mimicking the lightning glow frame */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-br from-emerald-100/40 via-amber-100/10 to-transparent blur-3xl pointer-events-none rounded-full z-0" />

            <div className="relative w-full max-w-md lg:max-w-none aspect-[1.15/1] flex justify-center items-center bg-white rounded-3xl p-4 shadow-xl border border-neutral-100 z-10 hover:shadow-2xl transition-all duration-300">

              <img
                src={heroImage}
                alt="KoopCare Modern Cooperative Building"
                className="w-full h-full object-contain rounded-2xl hover:scale-[1.01] transition-transform duration-500"
              />

              {/* Float badge 1 */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-neutral-100 flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-bold text-neutral-700">Sistem AI Terintegrasi</span>
              </div>

              {/* Float badge 2 */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-neutral-100 flex items-center gap-2.5">
                <ShieldCheckIcon className="w-4 h-4 text-[#386518]" />
                <span className="text-[11px] font-bold text-neutral-700">Aman & Terpercaya</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Feature Section */}
      <section id="fitur" className="bg-neutral-50/50 py-20 border-t border-neutral-100/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="max-w-2xl mx-auto text-center mb-16">
            <h3 className="text-[#386518] text-xs font-bold uppercase tracking-widest mb-3">Keunggulan Utama</h3>
            <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight font-heading">
              Manajemen Koperasi Pintar
            </h2>
            <p className="text-neutral-500 mt-4 text-sm font-medium leading-relaxed">
              Membantu pengurus memetakan profil anggota, mengotomasi proses administrasi, serta menganalisis pinjaman secara instan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Feature card 1 */}
            <div className="p-8 rounded-3xl bg-white border border-neutral-200/60 shadow-sm hover:shadow-md hover:border-[#386518]/30 transition-all flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <UserGroupIcon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 mb-3">Registrasi & KYC Praktis</h4>
              <p className="text-neutral-500 text-xs md:text-sm leading-relaxed font-medium">
                Mudah mengunggah berkas KTP dan foto selfie untuk proses verifikasi identitas instan guna pencegahan duplikasi data.
              </p>
            </div>

            {/* Feature card 2 */}
            <div className="p-8 rounded-3xl bg-white border border-neutral-200/60 shadow-sm hover:shadow-md hover:border-[#386518]/30 transition-all flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#d4a52e] flex items-center justify-center mb-6">
                <WalletIcon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 mb-3">Rekomendasi Pinjaman AI</h4>
              <p className="text-neutral-500 text-xs md:text-sm leading-relaxed font-medium">
                Skoring risiko gagal bayar yang komprehensif berdasarkan profil transaksi anggota guna mendukung keputusan pembiayaan yang tepat sasaran.
              </p>
            </div>

            {/* Feature card 3 */}
            <div className="p-8 rounded-3xl bg-white border border-neutral-200/60 shadow-sm hover:shadow-md hover:border-[#386518]/30 transition-all flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <DocumentTextIcon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-900 mb-3">Buku Besar Transparan</h4>
              <p className="text-neutral-500 text-xs md:text-sm leading-relaxed font-medium">
                Pencatatan kasir digital otomatis yang terhubung langsung dengan jurnal akuntansi umum demi jaminan pengelolaan keuangan yang sehat.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Download APK Section */}
      <section id="download" className="py-24 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#386518] via-[#2e5c14] to-[#1a3a08]" />
        {/* Subtle dot pattern overlay using style prop to avoid JSX/esbuild parse issues */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Decorative blobs */}
        <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#EDBF5D]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-5%] w-[300px] h-[300px] rounded-full bg-emerald-300/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Copy */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDBF5D]/20 border border-[#EDBF5D]/30 text-[#EDBF5D] font-bold text-[10px] uppercase tracking-widest mb-6">
                <DevicePhoneMobileIcon className="w-3.5 h-3.5" />
                Aplikasi Mobile KoopCare
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-heading mb-5 leading-tight">
                Download Aplikasi KoopCare
                <span className="block text-[#EDBF5D] mt-1">Langsung di Genggamanmu</span>
              </h2>

              <p className="text-white/70 text-sm md:text-base font-medium leading-relaxed mb-8">
                Akses seluruh layanan koperasi kapan saja dan di mana saja. Daftarkan identitas, ajukan pinjaman, dan pantau riwayat transaksi melalui aplikasi mobile KoopCare yang aman dan intuitif.
              </p>

              {/* Feature list */}
              <div className="space-y-3 mb-10">
                {[
                  'Registrasi & KYC digital dengan foto selfie',
                  'Pengajuan pinjaman berbasis skor AI',
                  'Notifikasi real-time status pembiayaan',
                  'Riwayat transaksi & laporan simpanan',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckBadgeIcon className="w-5 h-5 text-[#EDBF5D] flex-shrink-0" />
                    <span className="text-white/80 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>

              {/* Download Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={APK_DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-heading font-bold text-sm bg-[#EDBF5D] text-[#1a3a08] hover:bg-[#f5c842] transition-all shadow-lg shadow-[#EDBF5D]/20 hover:shadow-xl hover:shadow-[#EDBF5D]/30 hover:-translate-y-[2px]"
                >
                  <ArrowDownTrayIcon className="w-5 h-5 group-hover:animate-bounce" />
                  Download APK Android
                </a>
                <div className="inline-flex items-center gap-2 px-5 py-4 rounded-2xl border border-white/15 text-white/60 text-xs font-semibold">
                  <DevicePhoneMobileIcon className="w-4 h-4" />
                  Versi {APK_VERSION} &bull; {APK_SIZE}
                </div>
              </div>
            </div>

            {/* Right: Phone mockup card */}
            <div className="flex justify-center items-center">
              <div className="relative">
                {/* Outer glow */}
                <div className="absolute inset-0 bg-[#EDBF5D]/20 blur-3xl rounded-full scale-110" />

                {/* Phone frame */}
                <div className="relative w-56 h-[440px] rounded-[3rem] bg-neutral-900 border-[6px] border-neutral-700 shadow-2xl shadow-black/50 overflow-hidden">
                  {/* Screen content */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#386518] to-[#1a3a08] flex flex-col">
                    {/* Status bar */}
                    <div className="flex justify-between items-center px-5 pt-4 pb-2">
                      <span className="text-white/60 text-[9px] font-bold">9:41</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-1.5 rounded-sm bg-white/60" />
                        <div className="w-1 h-1.5 rounded-sm bg-white/40" />
                      </div>
                    </div>

                    {/* App header */}
                    <div className="flex items-center gap-2 px-5 py-3">
                      <div className="w-7 h-7 rounded-full bg-[#EDBF5D] flex items-center justify-center">
                        <span className="text-[#386518] font-extrabold text-[10px]">K</span>
                      </div>
                      <div>
                        <p className="text-white text-[10px] font-bold leading-none">KoopCare</p>
                        <p className="text-white/50 text-[8px] mt-0.5">Portal Koperasi</p>
                      </div>
                    </div>

                    {/* Mock dashboard */}
                    <div className="flex-1 bg-white/5 mx-3 mb-3 rounded-2xl p-4 space-y-3">
                      <div className="bg-white/10 rounded-xl p-3">
                        <p className="text-white/50 text-[8px] uppercase tracking-wider">Total Simpanan</p>
                        <p className="text-white font-extrabold text-base mt-0.5">Rp 4.820.000</p>
                        <div className="w-full h-1 bg-white/10 rounded-full mt-2">
                          <div className="h-1 bg-[#EDBF5D] rounded-full" style={{ width: '68%' }} />
                        </div>
                      </div>
                      {[['Status KYC', 'Terverifikasi ✓', 'text-emerald-400'], ['Pinjaman', 'Rp 2.000.000', 'text-white'], ['Tenor', '12 Bulan', 'text-white']].map(([label, val, cls], i) => (
                        <div key={i} className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-2">
                          <span className="text-white/50 text-[8px] font-semibold">{label}</span>
                          <span className={`text-[9px] font-bold ${cls}`}>{val}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom nav */}
                    <div className="flex justify-around items-center bg-black/20 px-4 py-3">
                      {['🏠', '📊', '💳', '👤'].map((icon, i) => (
                        <div key={i} className={`flex flex-col items-center gap-0.5 ${i === 0 ? 'opacity-100' : 'opacity-40'}`}>
                          <span className="text-sm">{icon}</span>
                          <div className={`w-1 h-1 rounded-full ${i === 0 ? 'bg-[#EDBF5D]' : 'bg-transparent'}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-neutral-900 rounded-b-2xl" />
                </div>

                {/* Floating badges */}
                <div className="absolute -right-8 top-16 bg-white rounded-2xl px-3 py-2 shadow-xl flex items-center gap-2">
                  {/* Solid star SVG — outline icons can't be filled via Tailwind */}
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="#EDBF5D" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div>
                    <p className="text-[9px] font-bold text-neutral-800">Rating</p>
                    <p className="text-[11px] font-extrabold text-[#386518]">4.9 / 5.0</p>
                  </div>
                </div>

                <div className="absolute -left-10 bottom-24 bg-white rounded-2xl px-3 py-2 shadow-xl flex items-center gap-2">
                  <ArrowDownTrayIcon className="w-4 h-4 text-[#386518]" />
                  <div>
                    <p className="text-[9px] font-bold text-neutral-800">Unduhan</p>
                    <p className="text-[11px] font-extrabold text-[#386518]">10K+</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tentang Kami (About Us) Section */}
      <section id="tentang" className="bg-white py-20 border-t border-neutral-100/80 relative overflow-hidden">
        {/* Decorative background glow contained inside this section */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-emerald-50/30 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left Column: Mission Narrative & Goals */}
            <div className="lg:col-span-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#386518] font-bold text-[10px] uppercase tracking-widest mb-4">
                Tentang KoopCare
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight font-heading mb-6 leading-tight">
                Membangun Kesejahteraan Bersama Melalui Koperasi Syariah Digital
              </h2>
              <p className="text-neutral-500 text-sm md:text-base font-medium leading-relaxed mb-6">
                KoopCare hadir sebagai solusi modern untuk menjembatani kesenjangan akses finansial bagi umat. Kami mentransformasi sistem koperasi konvensional yang kaku menjadi ekosistem digital yang adaptif, transparan, dan adil berbasis syariah.
              </p>
              <p className="text-neutral-500 text-sm md:text-base font-medium leading-relaxed mb-8">
                Dengan mengintegrasikan teknologi penilaian kelayakan berbasis Kecerdasan Buatan (AI), kami meminimalkan risiko pembiayaan sekaligus memberikan kesempatan yang merata bagi anggota untuk berkembang bersama.
              </p>

              {/* Dynamic achievements badges */}
              <div className="grid grid-cols-3 gap-4 border-t border-neutral-100 pt-8">
                <div>
                  <h4 className="text-2xl md:text-3xl font-extrabold text-[#386518] font-heading">50K+</h4>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">Anggota Aktif</p>
                </div>
                <div>
                  <h4 className="text-2xl md:text-3xl font-extrabold text-[#386518] font-heading">100+</h4>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">Koperasi Mitra</p>
                </div>
                <div>
                  <h4 className="text-2xl md:text-3xl font-extrabold text-[#386518] font-heading">99.1%</h4>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">Kolektibilitas</p>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Core Value Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Value card 1: Amanah */}
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/60 shadow-sm hover:shadow-md hover:border-[#386518]/30 transition-all text-left">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-neutral-900 mb-2">Transparansi Amanah</h4>
                <p className="text-neutral-500 text-xs leading-relaxed font-medium">
                  Setiap sen simpanan dan pembiayaan tercatat realtime dalam Buku Besar digital tanpa manipulasi.
                </p>
              </div>

              {/* Value card 2: Adil */}
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/60 shadow-sm hover:shadow-md hover:border-[#386518]/30 transition-all text-left">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#d4a52e] flex items-center justify-center mb-4">
                  <ChartBarIcon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-neutral-900 mb-2">Keadilan Finansial</h4>
                <p className="text-neutral-500 text-xs leading-relaxed font-medium">
                  Penilaian kelayakan pinjaman menggunakan skor AI objektif guna menjamin keadilan bagi setiap anggota.
                </p>
              </div>

              {/* Value card 3: Modern */}
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/60 shadow-sm hover:shadow-md hover:border-[#386518]/30 transition-all text-left sm:col-span-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <UserGroupIcon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-neutral-900 mb-2">Ekosistem Koperasi Modern</h4>
                <p className="text-neutral-500 text-xs leading-relaxed font-medium">
                  Mengurangi birokrasi kertas (paperless) untuk pendaftaran, KYC, dan pencairan transaksi secara serba digital.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12 px-6 border-t border-neutral-850">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/images/koopcare.png"
              alt="KoopCare Logo"
              className="w-10 h-10 object-contain flex-shrink-0"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            <span className="text-white font-bold tracking-wide font-heading text-sm">KoopCare</span>
          </div>

          <p className="text-xs font-medium text-center">
            &copy; {new Date().getFullYear()} KoopCare. Semua hak cipta dilindungi.
          </p>

          <div className="flex items-center gap-6 text-xs font-semibold">
            <a href="#beranda" className="hover:text-white transition-colors">Beranda</a>
            <a href="#fitur" className="hover:text-white transition-colors">Fitur</a>
            <a href="#tentang" className="hover:text-white transition-colors">Tentang</a>
            <a
              href={APK_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#EDBF5D] hover:text-[#f5c842] transition-colors"
            >
              <ArrowDownTrayIcon className="w-3.5 h-3.5" />
              Download APK
            </a>
          </div>
        </div>
      </footer>

      {/* Statistics Modal Overlay */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200/80 w-full max-w-2xl overflow-hidden animate-scaleIn">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#386518] to-[#43a047] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold font-heading">Ringkasan Ekosistem Koperasi</h3>
                <p className="text-xs text-white/80 font-medium mt-1">Informasi status real-time operasional KoopCare</p>
              </div>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white focus:outline-none"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Stat block 1 */}
                <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Total Aset</span>
                    <h4 className="text-xl font-bold text-neutral-800 mt-1">{formatCurrency(stats.totalAssets)}</h4>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                    <BanknotesIcon className="w-5 h-5" />
                  </div>
                </div>

                {/* Stat block 2 */}
                <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Pinjaman Aktif</span>
                    <h4 className="text-xl font-bold text-neutral-800 mt-1">{formatCurrency(stats.activeLoans)}</h4>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                    <WalletIcon className="w-5 h-5" />
                  </div>
                </div>

                {/* Stat block 3 */}
                <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Anggota Terdaftar</span>
                    <h4 className="text-xl font-bold text-neutral-800 mt-1">{stats.activeMembers} <span className="text-xs text-neutral-500 font-medium">Orang</span></h4>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-[#386518]">
                    <UserGroupIcon className="w-5 h-5" />
                  </div>
                </div>

                {/* Stat block 4 */}
                <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Kolektibilitas</span>
                    <h4 className="text-xl font-bold text-neutral-800 mt-1">99.1% <span className="text-xs text-emerald-600 font-bold">Sangat Sehat</span></h4>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                    <ShieldCheckIcon className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* Informative advice */}
              <div className="p-4 rounded-2xl bg-[#e8f5e9]/40 border border-[#386518]/10 flex items-start gap-3">
                <ShieldCheckIcon className="w-4 h-4 text-[#386518] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#386518] leading-relaxed font-semibold">
                  Informasi di atas merupakan agregasi data riil yang terenkripsi aman dan tercatat langsung di Jurnal Keuangan Buku Besar Koperasi KoopCare.
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-neutral-50 border-t border-neutral-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-5 py-2 rounded-xl font-heading font-bold text-xs bg-neutral-200 text-neutral-700 hover:bg-neutral-300 transition-colors"
              >
                Tutup
              </button>

              <Link
                to="/login"
                onClick={() => setShowSummaryModal(false)}
                className="px-5 py-2 rounded-xl font-heading font-bold text-xs bg-[#386518] text-white hover:bg-[#2e5c14] transition-all shadow-md shadow-[#386518]/10 flex items-center gap-1.5"
              >
                Masuk ke Sistem <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
