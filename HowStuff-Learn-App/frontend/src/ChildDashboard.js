// src/ChildDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LearningPath from './LearningPath';

const ChildDashboard = () => {
    const [childData, setChildData] = useState({ learningPath: [], activities: [] });
    
    useEffect(() => {
        async function fetchData() {
            const response = await axios.get('/dashboard/child');
            setChildData(response.data);
        }
        fetchData();
    }, []);
    
    return (
        <div>
            <h1>Child's Learning Path</h1>
            <LearningPath path={childData.learningPath} />
            <div>
                <h2>Upcoming Activities</h2>
                {childData.activities.map(activity => (
                    <div key={activity.id}>
                        <h3>{activity.title}</h3>
                        <p>{activity.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChildDashboard;
