import React from 'react';
import { Outlet } from 'react-router-dom';
import '@/assets/styles/layout.css'; // Import your CSS

const SimulationLayout: React.FC = () => {
  return (
    <div className="simulation-layout">
      <header className="simulation-header">
        <nav className="simulation-nav">
          <h1 className="nav-brand">Simulation Playground</h1>
          <div className="nav-links">
            <a href="/dashboard" className="nav-link">Dashboard</a>
            <a href="/interactive" className="nav-link">Interactive</a>
          </div>
        </nav>
      </header>

      <main className="simulation-content">
        <Outlet />
      </main>
    </div>
  );
};

export default SimulationLayout;
