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
        recentActivities: [], 
        upcomingEvents: [] 
    });
    const [selectedChild, setSelectedChild] = useState(null); // For displaying selected child's details

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('/dashboard/parent');
                setParentData(response.data);
            } catch (error) {
                console.error("Error fetching parent dashboard data:", error);
            }
        }
        fetchData();
    }, []);

    const handleChildSelect = (childId) => {
        const child = parentData.children.find(child => child._id === childId);
        setSelectedChild(child);
    };

    return (
        <div className="parent-dashboard">
            <h1>Parent Dashboard</h1>

            <div className="overview">
                <h2>Children's Overview</h2>
                <ul>
                    {parentData.children.map(child => (
                        <li key={child._id} onClick={() => handleChildSelect(child._id)}>
                            {child.name} - Grade: {child.grade}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="progress-chart">
                <h2>Child's Progress</h2>
                {selectedChild ? (
                    <ProgressChart data={selectedChild.progress} />
                ) : (
                    <p>Please select a child to view their progress.</p>
                )}
            </div>

            <div className="learning-goals">
                <h2>Learning Goals</h2>
                {selectedChild ? (
                    <ul>
                        {selectedChild.learningGoals.map((goal, index) => (
                            <li key={index}>{goal.description} - Progress: {goal.progress}%</li>
                        ))}
                    </ul>
                ) : (
                    <p>Please select a child to view their learning goals.</p>
                )}
            </div>

            <div className="recent-activities">
                <h2>Recent Activities</h2>
                {selectedChild ? (
                    <ul>
                        {selectedChild.recentActivities.map((activity, index) => (
                            <li key={index}>{activity.description}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Please select a child to view recent activities.</p>
                )}
            </div>

            <div className="upcoming-events">
                <h2>Upcoming Events</h2>
                <ul>
                    {parentData.upcomingEvents.map((event, index) => (
                        <li key={index}>{event.date}: {event.description}</li>
                    ))}
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
