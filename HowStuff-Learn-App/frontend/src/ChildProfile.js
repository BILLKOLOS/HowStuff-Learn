// src/ChildProfile.js
import React from 'react';
import './css/ChildProfile.css'; // Optional: Create a CSS file for styles

const ChildProfile = ({ child }) => {
    return (
        <div className="child-profile">
            <h3>{child.name}'s Profile</h3>
            <p><strong>Grade:</strong> {child.grade}</p>
            <p><strong>Progress:</strong> {child.progress}%</p>

            <p><strong>Learning Goals:</strong></p>
            {child.learningGoals?.length > 0 ? (
                <ul>
                    {child.learningGoals.map((goal) => (
                        <li key={goal.id}>{goal.description} - Progress: {goal.progress}%</li>
                    ))}
                </ul>
            ) : (
                <p>No learning goals set.</p>
            )}

            <p><strong>Recent Activities:</strong></p>
            {child.recentActivities?.length > 0 ? (
                <ul>
                    {child.recentActivities.map((activity) => (
                        <li key={activity.id}>{activity.description}</li>
                    ))}
                </ul>
            ) : (
                <p>No recent activities.</p>
            )}

            <p><strong>Notifications:</strong></p>
            {child.notifications?.length > 0 ? (
                <ul>
                    {child.notifications.map((notification) => (
                        <li key={notification.id}>{notification.message}</li>
                    ))}
                </ul>
            ) : (
                <p>No notifications.</p>
            )}
        </div>
    );
};

export default ChildProfile;
