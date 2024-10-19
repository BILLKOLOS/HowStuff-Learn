// src/ManageChildren.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageChildren = () => {
    const [children, setChildren] = useState([]);
    const [name, setName] = useState('');
    const [grade, setGrade] = useState('');
    const [message, setMessage] = useState('');

    const fetchChildren = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve token from local storage
            const response = await axios.get('http://localhost:5000/users/children', { // Updated endpoint
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the header
                }
            });
            setChildren(response.data.children || []); // Ensure children is defined
        } catch (error) {
            setMessage('Failed to fetch children.');
            console.error("Error fetching children:", error);
        }
    };

    useEffect(() => {
        fetchChildren();
    }, []);

    const handleAddChild = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Retrieve token from local storage
            const response = await axios.post('http://localhost:5000/users/children/create', { name, grade }, { // Updated endpoint
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the header
                }
            });
            setMessage(response.data.message);
            fetchChildren(); // Refresh the list after adding
            setName('');
            setGrade('');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Error adding child.'); // Fallback error message
            console.error("Error adding child:", error);
        }
    };

    return (
        <div>
            <h2>Manage Children</h2>
            <form onSubmit={handleAddChild}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Child's Name"
                    required
                />
                <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="Child's Grade"
                    required
                />
                <button type="submit">Add Child</button>
            </form>
            {message && <p>{message}</p>}
            <ul>
                {children.map((child) => (
                    <li key={child._id}>
                        {child.name} - Grade: {child.grade} {/* Updated to show grade label */}
                        {/* Add buttons for editing and deleting if needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageChildren;
