// src/ParentDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProgressChart from './ProgressChart';
import NotificationList from './NotificationList'; // Component for notifications
import ChildProfile from './ChildProfile'; // Component to show child profile details
import './css/ParentDashboard.css'; // Import CSS for styling

const ParentDashboard = () => {
    const [parentData, setParentData] = useState({ 
        children: [], 
        notifications: [], 
        upcomingEvents: [] // Removed recent activities as it is not provided in the API
    });
    const [selectedChild, setSelectedChild] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token'); // Retrieve token from local storage
                const response = await axios.get('http://localhost:5000/users/children', { // Updated endpoint
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the header
                    }
                });
                // Ensure all necessary fields are defined
                setParentData({
                    children: response.data.children || [],
                    notifications: response.data.notifications || [],
                    upcomingEvents: response.data.upcomingEvents || [] // Updated to match the API response
                });
            } catch (error) {
                setError("Error fetching parent dashboard data. Please try again later.");
                console.error("Error fetching parent dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChildSelect = (childId) => {
        const child = parentData.children.find(child => child._id === childId);
        setSelectedChild(child);
    };

    const renderChildDetails = (child) => (
        <>
            <ProgressChart data={child.progress || []} /> {/* Default to an empty array if progress is undefined */}
            <div className="learning-goals">
                <h2>Learning Goals</h2>
                <ul>
                    {(child.learningGoals || []).map((goal, index) => ( // Default to an empty array
                        <li key={index}>{goal.description} - Progress: {goal.progress || 0}%</li> // Fallback to 0 if progress is undefined
                    )) || <li>No learning goals available.</li>} {/* Fallback message */}
                </ul>
            </div>
            <div className="recent-activities">
                <h2>Recent Activities</h2>
                <ul>
                    {(child.recentActivities || []).map((activity, index) => ( // Default to an empty array
                        <li key={index}>{activity.description}</li>
                    )) || <li>No recent activities available.</li>} {/* Fallback message */}
                </ul>
            </div>
        </>
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="parent-dashboard">
            <h1>Parent Dashboard</h1>

            <div className="overview">
                <h2>Children's Overview</h2>
                <ul>
                    {(parentData.children || []).map(child => ( // Default to an empty array
                        <li key={child._id} onClick={() => handleChildSelect(child._id)}>
                            {child.name} - Grade: {child.gradeLevel} {/* Updated to match the API field */}
                        </li>
                    )) || <li>No children available.</li>} {/* Fallback message */}
                </ul>
            </div>

            <div className="progress-chart">
                <h2>Child's Progress</h2>
                {selectedChild ? renderChildDetails(selectedChild) : <p>Please select a child to view their progress.</p>}
            </div>

            <div className="upcoming-events">
                <h2>Upcoming Events</h2>
                <ul>
                    {(parentData.upcomingEvents || []).map((event, index) => ( // Default to an empty array
                        <li key={index}>{event.date}: {event.description}</li>
                    )) || <li>No upcoming events available.</li>} {/* Fallback message */}
                </ul>
            </div>

            <div className="notifications">
                <h2>Notifications</h2>
                <NotificationList notifications={parentData.notifications} />
            </div>

            <div className="resources">
                <h2>Recommended Resources</h2>
                <p>Access educational materials tailored for your child.</p>
                <a href="/resources">View Resources</a>
            </div>

            <div className="communication">
                <h2>Communication with Teachers</h2>
                <p>You can send messages or schedule meetings with teachers.</p>
                <a href="/communication">Go to Communication Center</a>
            </div>

            <div className="support">
                <h2>Help & Support</h2>
                <p>If you have questions or need assistance, please reach out to our support team.</p>
                <a href="/support">Get Help</a>
            </div>

            {selectedChild && (
                <div className="child-profile">
                    <h2>Child Profile</h2>
                    <ChildProfile child={selectedChild} />
                </div>
            )}
        </div>
    );
};

export default ParentDashboard;
