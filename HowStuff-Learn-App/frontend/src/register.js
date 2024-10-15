import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './css/styles.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    userLevel: '',
  });

  const { username, email, password, userLevel } = formData;
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/users/register', formData);
      alert('User registered successfully!');
      
      // Check if redirectUrl is in the response and navigate accordingly
      if (res.data.redirectUrl) {
        navigate(res.data.redirectUrl); // Redirect based on server response
      } else {
        navigate('/dashboard'); // Default redirection if no redirectUrl is provided
      }

      console.log(res.data);
    } catch (error) {
      alert('Error during registration: ' + (error.response?.data?.error || 'An unexpected error occurred'));
      console.error(error.response?.data || error);
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="username" 
          value={username} 
          onChange={handleChange} 
          placeholder="Username" 
          required 
        />
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
        <select 
          name="userLevel" 
          value={userLevel} 
          onChange={handleChange} 
          required
        >
          <option value="">Select User Level</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
