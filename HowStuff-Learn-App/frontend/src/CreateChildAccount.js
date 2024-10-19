import React, { useState } from 'react';
import axios from 'axios';

const CreateChildAccount = () => {
  const [childName, setChildName] = useState('');
  const [grade, setGrade] = useState('');
  const [curriculum, setCurriculum] = useState('CBC');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleCreateChildAccount = async (e) => {
    e.preventDefault();
    try {
      // API request to create a child account
      await axios.post('http://localhost:5000/users/children/create', {
        name: childName,
        grade,
        curriculum
        // Assuming the backend automatically links the child to the authenticated parent
      });

      setSuccess('Child account created successfully!');
      setChildName('');
      setGrade('');
      setCurriculum('CBC'); // Reset form after success
      setError(''); // Clear error after successful submission
    } catch (error) {
      setError(error.response?.data?.error || 'Something went wrong!'); // Handle possible error response
      setSuccess(''); // Clear success message on error
    }
  };

  return (
    <div>
      <h2>Create Child Account</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleCreateChildAccount}>
        <input
          type="text"
          placeholder="Child's Name"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          required
        />
        <select
          value={curriculum}
          onChange={(e) => setCurriculum(e.target.value)}
        >
          <option value="CBC">CBC</option>
          <option value="Other">Other</option>
          {/* Add more curriculum options if needed */}
        </select>
        <button type="submit">Create Child Account</button>
      </form>
    </div>
  );
};

export default CreateChildAccount;
