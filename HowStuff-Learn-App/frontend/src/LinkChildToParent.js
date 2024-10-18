// src/components/LinkChildToParent.js
import React, { useState } from 'react';
import axios from 'axios';

const LinkChildToParent = ({ parentId }) => {
    const [childId, setChildId] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleLinkChild = async (e) => {
        e.preventDefault();
        try {
            // API request to link the child to the parent
            await axios.post('/api/linkChildToParent', { parentId, childId });

            setSuccess('Child linked to parent successfully!');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Link Child to Parent</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleLinkChild}>
                <input
                    type="text"
                    placeholder="Child ID"
                    value={childId}
                    onChange={(e) => setChildId(e.target.value)}
                    required
                />
                <button type="submit">Link Child</button>
            </form>
        </div>
    );
};

export default LinkChildToParent;
