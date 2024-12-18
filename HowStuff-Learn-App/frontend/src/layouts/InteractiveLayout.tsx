import React from 'react';
import { Outlet } from 'react-router-dom';
import '@/assets/styles/layout.css';

const InteractiveLayout: React.FC = () => {
  return (
    <div className="interactive-layout">
      <header className="interactive-header">
        <nav className="interactive-nav">
          <h1 className="nav-brand">Interactive Learning</h1>
          <div className="nav-links">
            <a href="/dashboard" className="nav-link">Dashboard</a>
            <a href="/interactive" className="nav-link">Interactive</a>
            <a href="/profile" className="nav-link">Profile</a>
          </div>
        </nav>
      </header>

      <main className="interactive-content">
        <Outlet />
      </main>
    </div>
  );
};

export default InteractiveLayout;
