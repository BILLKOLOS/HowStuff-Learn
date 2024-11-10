import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/slices/authSlice';
import '@/assets/styles/layout.css';

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-layout">
      <div className="auth-logo-container">
        <img
          className="auth-logo"
          src="src/assets/images/placeholder_logo.webp"
          alt="HLM"
        />
      </div>
      <div className="outlet-layout">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
