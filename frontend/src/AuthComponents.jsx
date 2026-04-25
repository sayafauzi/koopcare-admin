import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from './Store/UseAuthStore';

export const ProtectedRoute = () => {
  const { isAuthenticated, token } = useAuthStore();
  const isValidSession = isAuthenticated && !!token;

  return isValidSession ? <Outlet /> : <Navigate to="/login" replace />;
};

export const PublicRoute = () => {
  const { isAuthenticated, token } = useAuthStore();
  const isValidSession = isAuthenticated && !!token;

  return !isValidSession ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export const MainLayout = () => {
  return (
    <div className="main-wrapper">
      <Outlet />
    </div>
  );
};
