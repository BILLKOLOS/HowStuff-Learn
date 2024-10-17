// src/ParentDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProgressChart from './ProgressChart';

const ParentDashboard = () => {
    const [parentData, setParentData] = useState({ progress: [] });
    
    useEffect(() => {
        async function fetchData() {
            const response = await axios.get('/dashboard/parent');
            setParentData(response.data);
        }
        fetchData();
    }, []);
    
    return (
        <div>
            <h1>Parent Dashboard</h1>
            <div>
                <h2>Child's Progress</h2>
                <ProgressChart data={parentData.progress} />
            </div>
        </div>
    );
};

export default ParentDashboard;
