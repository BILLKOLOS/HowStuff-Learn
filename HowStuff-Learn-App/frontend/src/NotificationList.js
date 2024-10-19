// src/NotificationList.js
import React from 'react';
import './css/NotificationList.css'; // Optional: Create a CSS file for styles

const NotificationList = ({ notifications }) => {
    return (
        <div className="notification-list">
            <h4>Notifications</h4>
            {notifications.length > 0 ? (
                <ul>
                    {notifications.map((notification) => (
                        <li key={notification.id}>{notification.message}</li> // Use unique id for key
                    ))}
                </ul>
            ) : (
                <p>No notifications available.</p>
            )}
        </div>
    );
};

export default NotificationList;
