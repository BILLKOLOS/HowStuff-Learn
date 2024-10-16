import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Import Link for navigation
import Login from './login';  // Import the Login component
import Register from './register'; // Import the Register component
import Dashboard from './dashboard'; // Import the Dashboard component

const App = () => {
  return (
    <Router> {/* Wrap your app in Router */}
      <div className="app-container">
        <h1>Welcome to HowStuff & Learn App</h1>
        <nav>
          {/* Navigation Links */}
          <Link to="/">Login</Link> {/* Link to Login */}
          <Link to="/register">Register</Link> {/* Link to Register */}
          <Link to="/dashboard">Dashboard</Link> {/* Link to Dashboard */}
        </nav>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Set the route for Login */}
          <Route path="/register" element={<Register />} /> {/* Set the route for Register */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* Set the route for Dashboard */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
