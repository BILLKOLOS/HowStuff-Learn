import React, { useEffect, useState } from 'react';

interface Lecturer {
    name: string;
    email: string;
    phoneNumber: string;
    uniqueCode: string;
}

const LecturerDashboard: React.FC = () => {
    const [lecturerData, setLecturerData] = useState<Lecturer | null>(null);

    useEffect(() => {
        try {
            const storedLecturer = localStorage.getItem('lecturer');
            if (storedLecturer) {
                setLecturerData(JSON.parse(storedLecturer) as Lecturer);
            } else {
                alert('Please log in first.');
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error parsing lecturer data:', error);
            alert('An error occurred. Please log in again.');
            window.location.href = '/';
        }
    }, []);

    if (!lecturerData) return <p>Loading your dashboard...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Welcome, {lecturerData.name}</h1>
            <p><strong>Email:</strong> {lecturerData.email}</p>
            <p><strong>Phone Number:</strong> {lecturerData.phoneNumber}</p>
            <div className="mt-4">
                {/* Add additional functionality, e.g., lecture schedules, performance tracking */}
                <p>Your unique code: <strong>{lecturerData.uniqueCode}</strong></p>
                <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
                    View Lectures
                </button>
            </div>
        </div>
    );
};

export default LecturerDashboard;
