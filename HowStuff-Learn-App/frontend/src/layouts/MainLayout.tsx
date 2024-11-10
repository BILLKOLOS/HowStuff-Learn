import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import '@/assets/styles/layout.css';

const MainLayout: React.FC = () => {
    return (
        <div className="main-layout">
            <nav className="nav-container">
                <div className="nav-content">
                    <Link to="/" className="nav-brand">
                        HSL
                    </Link>
                    <div className="nav-links">
                        <Link to="/login" className="nav-link">
                            Sign in
                        </Link>
                        <Link to="/register" className="nav-button">
                            Sign up
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>

            <footer className="footer">
                <p className="footer-text">
                    © {new Date().getFullYear()} Your App. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default MainLayout;
