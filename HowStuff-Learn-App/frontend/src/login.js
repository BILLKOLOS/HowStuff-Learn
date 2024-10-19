import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './css/styles.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/users/login', formData);

      // Assuming the response contains user data including token and redirectUrl
      const { token, redirectUrl } = res.data;

      // Save token to localStorage
      localStorage.setItem('token', token);

      alert('Login successful!');

      // Redirect to the URL provided by the backend
      if (redirectUrl) {
        console.log("Navigating to:", redirectUrl); // Debug log
        navigate(redirectUrl); // Redirect using the URL from backend
      } else {
        alert('No redirect URL found');
      }

    } catch (error) {
      // Handle errors during login
      alert('Error during login: ' + (error.response?.data?.message || 'An unexpected error occurred'));
      console.error(error.response?.data || error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          value={email} 
          onChange={handleChange} 
          placeholder="Email" 
          required 
        />
        <input 
          type="password" 
          name="password" 
          value={password} 
          onChange={handleChange} 
          placeholder="Password" 
          required 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
