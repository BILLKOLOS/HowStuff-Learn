import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageChildren = () => {
    const [children, setChildren] = useState([]);
    const [name, setName] = useState('');
    const [grade, setGrade] = useState('');
    const [message, setMessage] = useState('');

    const fetchChildren = async () => {
        try {
            const response = await axios.get('/api/children'); // Assuming you have a route for fetching children
            setChildren(response.data);
        } catch (error) {
            setMessage('Failed to fetch children.');
        }
    };

    useEffect(() => {
        fetchChildren();
    }, []);

    const handleAddChild = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/children', { name, grade });
            setMessage(response.data.message);
            fetchChildren(); // Refresh the list after adding
            setName('');
            setGrade('');
        } catch (error) {
            setMessage(error.response.data.error);
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
                        {child.name} - {child.grade}
                        {/* Add buttons for editing and deleting if needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageChildren;
