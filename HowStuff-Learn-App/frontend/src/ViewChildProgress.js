import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/styles.css'; // Include styles for the component

const ViewChildProgress = ({ parentId, childId }) => {
  const [progressData, setProgressData] = useState(null); // State to hold progress data
  const [loading, setLoading] = useState(true); // State to show loading status
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // Make an API call to fetch the child's progress data
        const response = await axios.get(`http://localhost:5000/progress/${parentId}/${childId}`);
        setProgressData(response.data); // Set progress data in state
        setLoading(false); // Set loading to false when data is fetched
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching progress data');
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchProgress(); // Call the fetch function on component mount
  }, [parentId, childId]);

  if (loading) {
    return <div>Loading progress...</div>; // Show a loading indicator while data is being fetched
  }

  if (error) {
    return <div className="error">{error}</div>; // Show error message in case of an error
  }

  if (!progressData) {
    return <div>No progress data available for this child.</div>; // Show message if no progress data is available
  }

  return (
    <div className="progress-container">
      <h2>Child Progress</h2>
      <p><strong>Child's Name:</strong> {progressData.childName}</p>
      <p><strong>Current Grade:</strong> {progressData.grade}</p>
      
      <h3>Subjects and Progress</h3>
      <ul>
        {progressData.subjects.map((subject, index) => (
          <li key={index}>
            <strong>{subject.name}:</strong> {subject.progress}% complete
          </li>
        ))}
      </ul>
      
      <h3>Other Achievements</h3>
      <ul>
        {progressData.achievements.length > 0 ? (
          progressData.achievements.map((achievement, index) => (
            <li key={index}>
              {achievement}
            </li>
          ))
        ) : (
          <li>No achievements yet.</li>
        )}
      </ul>
    </div>
  );
};

export default ViewChildProgress;
