import React, { useState } from 'react';
import axios from 'axios';
import './css/styles.css'; // Ensure you import the styles

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    userLevel: '',
  });

  const { username, email, password, userLevel } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/users/register', formData);
      alert('User registered successfully!');
      console.log(res.data);
    } catch (error) {
      alert('Error during registration');
      console.error(error.response.data);
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
        <input 
          type="text" 
          name="userLevel" 
          value={userLevel} 
          onChange={handleChange} 
          placeholder="User Level" 
          required 
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
