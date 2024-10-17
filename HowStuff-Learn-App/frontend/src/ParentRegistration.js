import React, { useState } from 'react';
import axios from 'axios';

const ParentRegistration = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        childName: '',
        childGrade: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/users/register', formData);
            setMessage(response.data.message);
            // Reset form data after successful registration
            setFormData({
                username: '',
                email: '',
                password: '',
                childName: '',
                childGrade: '',
            });
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    return (
        <div>
            <h2>Parent Registration</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="childName"
                    placeholder="Child's Name"
                    value={formData.childName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="childGrade"
                    placeholder="Child's Grade"
                    value={formData.childGrade}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ParentRegistration;
