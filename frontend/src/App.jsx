import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import KYC from './pages/KYC/KYC';
import Loans from './pages/Loan/Loans';
import Cashier from './pages/Cashier/Cashier';
import Ledger from './pages/Ledger/Ledger';
import AdminSettings from './pages/Admin/AdminSettings';

import { ProtectedRoute, PublicRoute, MainLayout } from './AuthComponents';
import ToastContainer from './components/Toast/ToastContainer';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/kyc" element={<KYC />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/cashier" element={<Cashier />} />
            <Route path="/ledger" element={<Ledger />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
