// d:\koopcare-admin\frontend\src\pages\LandingPage\LandingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shovel, 
  UserCheck, 
  FileText, 
  Wallet, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Users, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X,
  TrendingUp,
  Lock
} from 'lucide-react';
import heroImage from '../../assets/hero-koopcare.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll helper
  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#2D3748] font-sans antialiased overflow-x-hidden">
      
      {/* 1. HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="p-2.5 bg-primary/10 rounded-xl flex items-center justify-center">
              <Shovel className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-primary leading-tight">KoopCare</h1>
              <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">Koperasi Masa Kini</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-colors cursor-pointer">
              Beranda
            </button>
            <button onClick={() => scrollToSection('fitur')} className="hover:text-primary transition-colors cursor-pointer">
              Fitur
            </button>
            <button onClick={() => scrollToSection('tentang')} className="hover:text-primary transition-colors cursor-pointer">
              Tentang Kami
            </button>
            <button onClick={() => scrollToSection('statistik')} className="hover:text-primary transition-colors cursor-pointer">
              Statistik
            </button>
          </nav>

          {/* Desktop Call to Action */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')} 
              className="px-6 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 rounded-full transition-all border border-primary/20"
            >
              Masuk
            </button>
            <button 
              onClick={() => navigate('/register')} 
              className="px-6 py-2.5 text-sm font-bold bg-secondary hover:bg-[#dbb46a] text-dark rounded-full shadow-sm hover:shadow-md transition-all"
            >
              Daftar Anggota
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-6 py-6 space-y-4 shadow-inner">
            <nav className="flex flex-col gap-4 text-sm font-semibold text-gray-600">
              <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }} className="text-left py-2 hover:text-primary">
                Beranda
              </button>
              <button onClick={() => scrollToSection('fitur')} className="text-left py-2 hover:text-primary">
                Fitur
              </button>
              <button onClick={() => scrollToSection('tentang')} className="text-left py-2 hover:text-primary">
                Tentang Kami
              </button>
              <button onClick={() => scrollToSection('statistik')} className="text-left py-2 hover:text-primary">
                Statistik
              </button>
            </nav>
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              <button 
                onClick={() => navigate('/login')} 
                className="w-full py-3 text-center text-sm font-bold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-all"
              >
                Masuk ke Portal
              </button>
              <button 
                onClick={() => navigate('/register')} 
                className="w-full py-3 text-center text-sm font-bold bg-secondary hover:bg-[#dbb46a] text-dark rounded-xl shadow-sm transition-all"
              >
                Daftar Anggota
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-8 pb-20 md:pt-12 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-[#F4F7F5] to-[#F8FAF9]">
        
        {/* Soft Background Decorative Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-48 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -ml-40 -mb-20"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column (Content) */}
            <div className="lg:col-span-7 flex flex-col space-y-6 md:space-y-8 z-10">
              
              {/* Badge Pill */}
              <div className="self-start">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  KoopCare - Layanan Koperasi Modern & Syariah
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-dark leading-tight md:leading-none">
                  Sistem Informasi <span className="text-primary bg-primary/5 px-2 rounded-lg">Manajemen Koperasi</span> Digital Modern
                </h2>
                <p className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed">
                  Membantu pengurus dan anggota mengelola data keanggotaan, verifikasi KYC, pengajuan pembiayaan syariah, pencatatan kasir, dan pembukuan otomatis secara mandiri, aman, dan transparan.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button 
                  onClick={() => navigate('/login')} 
                  className="px-8 py-4 bg-primary hover:bg-[#687a52] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer"
                >
                  Masuk ke Portal <ArrowRight size={18} />
                </button>
                <button 
                  onClick={() => scrollToSection('fitur')} 
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-primary border border-primary/20 font-bold rounded-xl shadow-sm hover:shadow transition-all text-center cursor-pointer"
                >
                  Lihat Fitur Layanan
                </button>
              </div>

              {/* Bottom Quick Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                
                {/* Quick Card 1 */}
                <div className="bg-white/80 backdrop-blur border border-gray-100 rounded-2xl p-4.5 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1 duration-300">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <UserCheck size={20} />
                  </div>
                  <h3 className="font-bold text-sm text-dark mb-1">Verifikasi KYC</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">Registrasi dan validasi anggota koperasi digital aman & valid.</p>
                </div>

                {/* Quick Card 2 */}
                <div className="bg-white/80 backdrop-blur border border-gray-100 rounded-2xl p-4.5 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1 duration-300">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 text-[#be934c] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <FileText size={20} />
                  </div>
                  <h3 className="font-bold text-sm text-dark mb-1">Pinjaman Syariah</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">Kelola pengajuan akad pembiayaan adil dan bebas riba.</p>
                </div>

                {/* Quick Card 3 */}
                <div className="bg-white/80 backdrop-blur border border-gray-100 rounded-2xl p-4.5 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1 duration-300">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Wallet size={20} />
                  </div>
                  <h3 className="font-bold text-sm text-dark mb-1">Kasir & Buku Besar</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">Pembukuan keuangan, neraca, dan laba rugi realtime.</p>
                </div>

              </div>

            </div>

            {/* Right Column (Visual Image) */}
            <div className="lg:col-span-5 relative flex items-center justify-center z-10">
              
              {/* Decorative dotted grid pattern behind image */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[radial-gradient(#E5C07A_2px,transparent_2px)] [background-size:12px_12px] opacity-40 pointer-events-none"></div>
              
              {/* Image Frame Container */}
              <div className="relative w-full max-w-md lg:max-w-none bg-white p-3 rounded-3xl shadow-2xl border border-gray-100 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src={heroImage} 
                  alt="Kantor Layanan KoopCare" 
                  className="w-full h-auto object-cover rounded-2xl shadow-inner bg-gray-50"
                />
                
                {/* Floating Service Schedule Card (Matches Image Jam Pelayanan Concept) */}
                <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 flex items-start gap-4 max-w-xs transition-all hover:scale-105 duration-300">
                  <div className="p-3 bg-secondary/15 rounded-xl text-secondary flex items-center justify-center shrink-0">
                    <Clock className="h-6 w-6 text-[#c69a47]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-dark tracking-wide uppercase mb-1.5">Jam Layanan Kantor</h4>
                    <p className="text-xs text-gray-700 font-semibold">Senin s/d Jumat</p>
                    <p className="text-[11px] text-gray-500 mb-1">08:00 WIB - 15:30 WIB</p>
                    <p className="text-xs text-gray-700 font-semibold">Sabtu (Setengah Hari)</p>
                    <p className="text-[11px] text-gray-500">08:00 WIB - 12:00 WIB</p>
                  </div>
                </div>

                {/* Floating Member Badge */}
                <div className="absolute -top-4 -right-4 bg-primary text-white py-2.5 px-4 rounded-2xl shadow-lg border border-primary/20 flex items-center gap-2.5 transition-all hover:scale-105 duration-300">
                  <div className="p-1 bg-white/20 rounded-lg">
                    <Users size={16} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-white/80 font-medium">Anggota Aktif</p>
                    <p className="text-xs font-bold leading-tight">50.000+ Orang</p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. CORE BENEFITS SECTION */}
      <section id="tentang" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold tracking-widest text-primary uppercase">Mengapa Memilih Kami</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-dark leading-tight">
              Pilar Utama Kepercayaan Pengelolaan Anggota & Keuangan Koperasi
            </h3>
            <p className="text-gray-500 text-sm md:text-base">
              Kami menggabungkan prinsip dasar kekeluargaan koperasi dengan teknologi modern yang transparan dan bersahabat.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Benefit 1 */}
            <div className="bg-light/50 border border-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-extrabold text-xl text-dark">Kepatuhan Syariah</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Setiap bentuk transaksi simpanan, bagi hasil, dan pengajuan dana dirancang sesuai kaidah syariah tanpa adanya bunga atau riba terselubung.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-gray-600 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary" /> Pengawasan Dewan Syariah</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary" /> Akad Jelas di Awal</li>
              </ul>
            </div>

            {/* Benefit 2 */}
            <div className="bg-light/50 border border-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 text-[#be934c] flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <h4 className="font-extrabold text-xl text-dark">Transparansi Laba Rugi</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Anggota berhak melihat laporan arus kas dan performa keuangan koperasi secara langsung melalui portal untuk mewujudkan asas keterbukaan.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-gray-600 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary" /> Dashboard Buku Besar Realtime</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary" /> Laporan SHU yang Akurat</li>
              </ul>
            </div>

            {/* Benefit 3 */}
            <div className="bg-light/50 border border-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Lock size={24} />
              </div>
              <h4 className="font-extrabold text-xl text-dark">Keamanan Data Tinggi</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Menggunakan sistem otentikasi ketat, kode undang eksklusif, serta pencadangan berkala untuk menjaga aset dan data pribadi Anda.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-gray-600 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary" /> Verifikasi Berkas KYC Ketat</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-primary" /> Keamanan Rekening Anggota</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 4. FITUR DETAIL SECTION (Matches visual modular approach) */}
      <section id="fitur" className="py-20 bg-[#F4F7F5]">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4">
            <div className="space-y-3 max-w-xl">
              <h2 className="text-xs font-bold tracking-widest text-primary uppercase">Ekosistem Koperasi</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-dark leading-tight">
                Modul Sistem Terintegrasi Untuk Mengelola Koperasi Anda
              </h3>
            </div>
            <p className="text-gray-500 text-sm max-w-sm">
              Dirancang khusus untuk mendukung operasional harian pengurus koperasi serta kenyamanan transaksi bagi anggota koperasi.
            </p>
          </div>

          {/* Module Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Module 1 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6.5 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <UserCheck size={24} />
              </div>
              <h4 className="font-bold text-lg text-dark mb-2">Portal KYC Anggota</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Pendaftaran mandiri bagi calon anggota dengan formulir data diri lengkap, unggah foto KTP, selfie, serta proses peninjauan persetujuan admin digital.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                Lihat Detail Portal <ArrowRight size={14} />
              </div>
            </div>

            {/* Module 2 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6.5 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 text-[#be934c] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <h4 className="font-bold text-lg text-dark mb-2">Manajemen Akad Pinjaman</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Sistem pengajuan pembiayaan syariah lengkap dengan kalkulator margin keuntungan, tenor pembayaran, validasi kelayakan kredit, serta monitoring status angsuran.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                Lihat Detail Modul <ArrowRight size={14} />
              </div>
            </div>

            {/* Module 3 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6.5 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Wallet size={24} />
              </div>
              <h4 className="font-bold text-lg text-dark mb-2">Kasir & Mutasi Saldo</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Layanan transaksi kasir harian untuk simpanan wajib, simpanan sukarela, penarikan dana, serta pembayaran angsuran pinjaman yang tercatat realtime.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                Lihat Detail Kasir <ArrowRight size={14} />
              </div>
            </div>

            {/* Module 4 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6.5 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h4 className="font-bold text-lg text-dark mb-2">Buku Besar & Jurnal Keuangan</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Pencatatan akuntansi otomatis untuk setiap mutasi kasir yang langsung dipetakan ke dalam bagan akun, jurnal umum, neraca saldo, serta laporan laba rugi.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                Lihat Detail Jurnal <ArrowRight size={14} />
              </div>
            </div>

            {/* Module 5 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6.5 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 text-[#be934c] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <h4 className="font-bold text-lg text-dark mb-2">Kode Undangan Eksklusif</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Fitur administratif bagi pengurus koperasi untuk membuat dan mengelola kode rujukan pendaftaran guna mengontrol masuknya keanggotaan baru.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                Lihat Manajemen Kode <ArrowRight size={14} />
              </div>
            </div>

            {/* Module 6 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6.5 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Lock size={24} />
              </div>
              <h4 className="font-bold text-lg text-dark mb-2">Dashboard Admin Terpusat</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Panel utama bagi pengurus koperasi untuk melacak total anggota, antrean KYC, total pembiayaan aktif, posisi saldo kas, serta grafik kesehatan koperasi harian.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                Masuk ke Dashboard <ArrowRight size={14} />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. STATS SECTION (Premium glassmorphic background) */}
      <section id="statistik" className="py-16 bg-white relative overflow-hidden">
        
        {/* Soft Gold Background orb */}
        <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-primary text-white rounded-3xl p-10 md:p-16 shadow-2xl border border-primary/20 relative z-10 overflow-hidden">
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
              
              {/* Stat 1 */}
              <div className="space-y-2 border-r border-white/10 last:border-0 pr-4 last:pr-0">
                <p className="text-3xl md:text-5xl font-extrabold tracking-tight text-secondary">50.000+</p>
                <p className="text-xs md:text-sm text-gray-200 font-semibold uppercase tracking-wider">Anggota Terdaftar</p>
              </div>

              {/* Stat 2 */}
              <div className="space-y-2 lg:border-r border-white/10 last:border-0 pr-4 last:pr-0">
                <p className="text-3xl md:text-5xl font-extrabold tracking-tight text-secondary">Rp 50M+</p>
                <p className="text-xs md:text-sm text-gray-200 font-semibold uppercase tracking-wider">Aset Dikelola</p>
              </div>

              {/* Stat 3 */}
              <div className="space-y-2 border-r border-white/10 last:border-0 pr-4 last:pr-0">
                <p className="text-3xl md:text-5xl font-extrabold tracking-tight text-secondary">100%</p>
                <p className="text-xs md:text-sm text-gray-200 font-semibold uppercase tracking-wider">Prinsip Syariah & Transparan</p>
              </div>

              {/* Stat 4 */}
              <div className="space-y-2 last:border-0">
                <p className="text-3xl md:text-5xl font-extrabold tracking-tight text-secondary">12+</p>
                <p className="text-xs md:text-sm text-gray-200 font-semibold uppercase tracking-wider">Kantor Layanan Cabang</p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="py-20 bg-gradient-to-t from-[#EBF0EC] to-white relative">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-dark leading-tight">
            Siap Bergabung dan Memulai Transformasi Koperasi Digital Modern?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Daftarkan diri Anda sebagai anggota hari ini untuk mendapatkan kemudahan akses keuangan berazas kekeluargaan, amanah, dan menguntungkan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button 
              onClick={() => navigate('/register')} 
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-[#687a52] text-white font-bold rounded-xl shadow-lg transition-all"
            >
              Registrasi Anggota Baru
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-primary border border-primary/20 font-bold rounded-xl shadow-sm transition-all"
            >
              Akses Portal Admin / Pengurus
            </button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-dark text-white/80 py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Info (Col span 4) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl flex items-center justify-center">
                <Shovel className="h-6 w-6 text-secondary" />
              </div>
              <h2 className="text-xl font-extrabold text-white">KoopCare</h2>
            </div>
            <p className="text-xs text-white/60 leading-relaxed max-w-sm">
              KoopCare adalah pionir platform teknologi manajemen koperasi digital yang berazaskan kekeluargaan, transparansi, serta kepatuhan syariah demi mendukung kemandirian finansial umat.
            </p>
          </div>

          {/* Navigasi (Col span 4) */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Tautan Pintas</h3>
            <ul className="grid grid-cols-2 gap-2 text-xs">
              <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-secondary hover:underline transition-all">Beranda</button></li>
              <li><button onClick={() => scrollToSection('fitur')} className="hover:text-secondary hover:underline transition-all">Fitur Layanan</button></li>
              <li><button onClick={() => scrollToSection('tentang')} className="hover:text-secondary hover:underline transition-all">Tentang Kami</button></li>
              <li><button onClick={() => scrollToSection('statistik')} className="hover:text-secondary hover:underline transition-all">Statistik</button></li>
              <li><button onClick={() => navigate('/login')} className="hover:text-secondary hover:underline transition-all">Portal Masuk</button></li>
              <li><button onClick={() => navigate('/register')} className="hover:text-secondary hover:underline transition-all">Registrasi Anggota</button></li>
            </ul>
          </div>

          {/* Kontak & Lokasi (Col span 4) */}
          <div className="md:col-span-4 space-y-4 text-xs">
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">Hubungi Kami</h3>
            <div className="space-y-3 text-white/70">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-secondary shrink-0 mt-0.5" />
                <p>Jl. Jenderal Sudirman No. 123, Komplek Perkantoran Graha Koperasi, Jakarta, Indonesia</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-secondary shrink-0" />
                <p>+62 (21) 555-8765</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-secondary shrink-0" />
                <p>support@koopcare.id</p>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 font-medium">
          <p>© {new Date().getFullYear()} KoopCare. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-secondary hover:underline transition-all">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-secondary hover:underline transition-all">Kebijakan Privasi</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
