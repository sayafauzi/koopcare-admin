import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import KYC from './pages/KYC/KYC';
import Loans from './pages/Loan/Loans';
import Cashier from './pages/Cashier/Cashier';
import Ledger from './pages/Ledger/Ledger';
import LandingPage from './pages/LandingPage/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kyc" element={<KYC />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/cashier" element={<Cashier />} />
        <Route path="/ledger" element={<Ledger />} />
        
        {/* Root Landing Page */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;