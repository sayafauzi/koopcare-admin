import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import MemberListPage from './features/members/MemberListPage';
import KycListPage from './features/kyc/KycListPage';
import LoanListPage from './features/loans/LoanListPage';
import CashierPage from './features/cashier/CashierPage';
import LedgerPage from './features/ledger/LedgerPage';
import useAuthStore from './store/authStore';
import RegisterPage from './features/auth/RegisterPage';
import InviteCodeManagementPage from './features/admin/InviteCodeManagementPage';
import LandingPage from './pages/LandingPage/LandingPage';

// Sementara bypass auth agar bisa lihat tampilan (backend belum siap)
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  // Untuk sementara, anggap selalu login
  return children;
  // return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Admin Portal (Private Routes) */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="members" element={<MemberListPage />} />
          <Route path="kyc" element={<KycListPage />} />
          <Route path="loans" element={<LoanListPage />} />
          <Route path="cashier" element={<CashierPage />} />
          <Route path="ledger" element={<LedgerPage />} />
          <Route path="admin/invite-codes" element={<InviteCodeManagementPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;