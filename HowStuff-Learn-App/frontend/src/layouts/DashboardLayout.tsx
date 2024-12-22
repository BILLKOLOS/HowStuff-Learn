import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/slices/authSlice';
import '@/assets/styles/layout.css';
import { useAuth } from '@/hooks/useAuth';

const DashboardLayout: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <nav className="dashboard-nav">
          <h1 className="nav-brand">Dashboard</h1>
          <div className="nav-links">
            <span className="nav-link">Welcome, {user?.name}</span>

            {/* Conditional link for lecturers */}
            {user?.role === 'lecturer' && (
              <Link to="/lecturer-dashboard" className="nav-link">Lecturer Dashboard</Link>
            )}

            <Link to="/interactive" className="nav-link">Interactive</Link>
            <button onClick={logout} className="nav-button">Logout</button>
          </div>
        </nav>
      </header>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
