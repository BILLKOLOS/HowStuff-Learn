// src/components/CreateChildAccount.js
import React, { useState } from 'react';
import axios from 'axios';

const CreateChildAccount = ({ parentId }) => {
    const [childName, setChildName] = useState('');
    const [grade, setGrade] = useState('');
    const [curriculum, setCurriculum] = useState('CBC');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleCreateChildAccount = async (e) => {
        e.preventDefault();
        try {
            // API request to create a child account linked to the parent
            await axios.post('/api/createChildAccount', {
                parentId,
                childName,
                grade,
                curriculum
            });

            setSuccess('Child account created successfully!');
        } catch (error) {
            setError(error.message);
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
                    {/* Add other curriculum options if needed */}
                </select>
                <button type="submit">Create Child Account</button>
            </form>
        </div>
    );
};

export default CreateChildAccount;
