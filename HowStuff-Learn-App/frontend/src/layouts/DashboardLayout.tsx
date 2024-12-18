import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom'; // Import Link
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
            <Link to="/interactive" className="nav-link">Interactive</Link> {/* Add the Interactive link */}
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
