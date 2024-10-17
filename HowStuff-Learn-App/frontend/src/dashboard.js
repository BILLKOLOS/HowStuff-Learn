import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/dashboard.css'; // Corrected the path to the CSS file

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    upcomingLectures: [],
    recentQuizzes: [],
    progress: [],
    suggestedResources: [],
    gamificationStatus: {},
    activityFeed: [],
    notifications: [],
    arvrModules: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get JWT token
        const response = await axios.get('http://localhost:5000/dashboard', { // Full URL to backend
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching dashboard data');
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading your dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard">
      <h1>Welcome to Your Dashboard</h1>

      {/* Upcoming AR/VR Lectures */}
      <section>
        <h2>Upcoming AR/VR Lectures</h2>
        {dashboardData.upcomingLectures.length === 0 ? (
          <p>No upcoming AR/VR lectures.</p>
        ) : (
          <ul>
            {dashboardData.upcomingLectures.map((lecture) => (
              <li key={lecture._id}>
                <h3>{lecture.title}</h3>
                <p>{new Date(lecture.startTime).toLocaleString()}</p>
                <p>Mode: {lecture.isAR ? 'AR' : 'VR'}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recent AR/VR Quizzes */}
      <section>
        <h2>Recent AR/VR Quizzes</h2>
        {dashboardData.recentQuizzes.length === 0 ? (
          <p>No recent AR/VR quizzes.</p>
        ) : (
          <ul>
            {dashboardData.recentQuizzes.map((quiz) => (
              <li key={quiz._id}>
                <h3>{quiz.title}</h3>
                <p>Date Taken: {new Date(quiz.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Progress Section */}
      <section>
        <h2>Your Progress</h2>
        {dashboardData.progress.length === 0 ? (
          <p>No progress data available.</p>
        ) : (
          <ul>
            {dashboardData.progress.map((progressItem) => (
              <li key={progressItem.assessmentId._id}>
                <h3>{progressItem.assessmentId.title}</h3>
                <p>Progress: {progressItem.percentage}%</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Suggested Resources */}
      <section>
        <h2>Suggested AR/VR Resources</h2>
        {dashboardData.suggestedResources.length === 0 ? (
          <p>No AR/VR resources found.</p>
        ) : (
          <ul>
            {dashboardData.suggestedResources.map((resource) => (
              <li key={resource._id}>
                <h3>{resource.title}</h3>
                <p>Resource Type: {resource.isAR ? 'AR' : 'VR'}</p>
                <a href={resource.link}>View Resource</a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Gamification Status */}
      <section>
        <h2>Your Gamification Status</h2>
        {dashboardData.gamificationStatus && dashboardData.gamificationStatus.badges ? (
          <div>
            <h3>Badges Earned:</h3>
            <ul>
              {dashboardData.gamificationStatus.badges.map((badge) => (
                <li key={badge.id}>
                  <img src={badge.imageUrl} alt={badge.title} />
                  <p>{badge.title}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No badges earned yet.</p>
        )}
      </section>

      {/* Activity Feed */}
      <section>
        <h2>Recent Activities</h2>
        {dashboardData.activityFeed.length === 0 ? (
          <p>No recent activities to show.</p>
        ) : (
          <ul>
            {dashboardData.activityFeed.map((activity) => (
              <li key={activity._id}>
                <p>{activity.description}</p>
                <p>{new Date(activity.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Notifications */}
      <section>
        <h2>Your Notifications</h2>
        {dashboardData.notifications.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          <ul>
            {dashboardData.notifications.map((notification) => (
              <li key={notification._id}>
                <p>{notification.message}</p>
                <p>{new Date(notification.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
