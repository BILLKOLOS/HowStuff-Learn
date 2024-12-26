import React from 'react';
import { Link } from 'react-router-dom';
import '@/assets/styles/home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to How Stuff Learn</h1>
      <p className="home-subtitle">
        A secure and efficient platform for Learning. Get started today
        and experience the difference.
      </p>
      <div className="home-buttons">
        <Link to="/register" className="primary-button">
          Get Started
        </Link>
        <Link to="/login" className="secondary-button">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Home;
