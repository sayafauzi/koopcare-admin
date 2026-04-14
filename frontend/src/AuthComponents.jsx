import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
  return !!localStorage.getItem('token'); 
};


export const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};


export const PublicRoute = () => {
  return !isAuthenticated() ? <Outlet /> : <Navigate to="/dashboard" replace />;
};


export const MainLayout = () => {
  return (
    <div className="main-layout">
      {}
      <header style={{ padding: '1rem', background: '#f4f4f4' }}>
        <h2>Admin Panel</h2>
      </header>
      
      <main style={{ padding: '20px' }}>
        <Outlet /> {}
      </main>
    </div>
  );
};