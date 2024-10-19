import React from 'react';
import PropTypes from 'prop-types';
import './css/ProgressChart.css'; // Ensure the CSS file exists for styling

const ProgressChart = ({ data }) => {
    if (!data || data.length === 0) { // Check if data is undefined or empty
        return (
            <div className="progress-chart">
                <h2>Progress Overview</h2>
                <p>No progress data available.</p>
            </div>
        );
    }

    const totalProgress = data.reduce((acc, curr) => acc + curr.progress, 0);
    const averageProgress = totalProgress / data.length;

    return (
        <div className="progress-chart">
            <h2>Progress Overview</h2>
            <div className="chart">
                <div
                    className="progress-bar"
                    style={{ width: `${averageProgress}%` }} // Correct dynamic style syntax
                    aria-valuenow={averageProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    role="progressbar"
                >
                    {averageProgress.toFixed(0)}%
                </div>
            </div>
            <div className="progress-details">
                <h4>Individual Progress</h4>
                <ul>
                    {data.map((item, index) => (
                        <li key={index}>
                            <strong>Task {index + 1}:</strong> {item.progress}%
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// PropTypes to validate the data prop
ProgressChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            progress: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default ProgressChart;
