import React, { useState } from 'react';
import axios from 'axios';
import './css/styles.css'; // Ensure you import the styles

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/users/login', formData);
      localStorage.setItem('token', res.data.token); // Corrected from lStorage to localStorage
      alert('Login successful!');
      console.log(res.data);
    } catch (error) {
      alert('Error during login: ' + (error.response?.data?.error || 'An unexpected error occurred'));
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
