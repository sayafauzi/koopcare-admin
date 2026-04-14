import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import KYC from './pages/KYC/KYC';
import Loans from './pages/Loan/Loans';
import Cashier from './pages/Cashier/Cashier';
import Ledger from './pages/Ledger/Ledger';

import { ProtectedRoute, PublicRoute, MainLayout } from './AuthComponents';

function App() {
  return (
    <Router>
      <Routes>
        {}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/kyc" element={<KYC />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/cashier" element={<Cashier />} />
            <Route path="/ledger" element={<Ledger />} />
          </Route>
        </Route>

        {}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;