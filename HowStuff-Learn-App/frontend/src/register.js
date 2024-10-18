import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/styles.css';

const USER_LEVELS = {
  KINDERGARTEN: 'Kindergarten',
  PRIMARY: 'Primary',
  JUNIOR_SECONDARY: 'Junior Secondary',
  HIGH_SCHOOL: 'High School',
  COLLEGE: 'College',
  UNIVERSITY: 'University',
  SPECIALIZED: 'Specialized Education',
};

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    userLevel: '',
    role: 'user', // Change userType to role
    childName: '',
    childGrade: '',
  });

  const { username, email, password, userLevel, role, childName, childGrade } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic email and password validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      alert('Password should be at least 6 characters long.');
      return;
    }

    // Prepare data based on the user type
    const dataToSubmit = role === 'parent' 
      ? { username, email, password, role, childName, childGrade }
      : { username, email, password, role, userLevel }; // Include role and userLevel for 'user'

    // Log the data being sent
    console.log("Data to submit:", dataToSubmit);

    try {
      await axios.post('http://localhost:5000/users/register', dataToSubmit);
      alert('User registered successfully!');
      navigate('/'); // Redirect to login page after successful registration
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

        <div className="user-type-selection">
          <label>
            <input 
              type="radio" 
              name="role" // Change name to role
              value="user" 
              checked={role === 'user'} 
              onChange={handleChange} 
            />
            User
          </label>
          <label>
            <input 
              type="radio" 
              name="role" // Change name to role
              value="parent" 
              checked={role === 'parent'} 
              onChange={handleChange} 
            />
            Parent
          </label>
        </div>

        {role === 'user' && (
          <select 
            name="userLevel" 
            value={userLevel} 
            onChange={handleChange} 
            required
          >
            <option value="">Select User Level</option>
            {Object.entries(USER_LEVELS).map(([key, value]) => (
              <option key={key} value={value}>{value}</option>
            ))}
          </select>
        )}

        {role === 'parent' && (
          <>
            <input 
              type="text" 
              name="childName" 
              value={childName} 
              onChange={handleChange} 
              placeholder="Child's Name" 
              required 
            />
            <input 
              type="text" 
              name="childGrade" 
              value={childGrade} 
              onChange={handleChange} 
              placeholder="Child's Grade" 
              required 
            />
          </>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
