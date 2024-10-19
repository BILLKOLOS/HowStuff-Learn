import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './login';
import Register from './register';
import Dashboard from './dashboard';
import ParentDashboard from './ParentDashboard'; // Import ParentDashboard component
import CreateChildAccount from './CreateChildAccount';
import LinkChildToParent from './LinkChildToParent';
import ViewChildProgress from './ViewChildProgress';

const App = () => {
  const parentId = "exampleParentId"; // This should come from the logged-in user's data
  const childId = "exampleChildId";   // This should be set dynamically based on selected child

  return (
    <Router> {/* Wrap your app in Router */}
      <div className="app-container">
        <h1>Welcome aboard, HowStuff & Learn App</h1>
        <nav>
          {/* Navigation Links */}
          <Link to="/">Login</Link> {/* Link to Login */}
          <Link to="/register">Register</Link> {/* Link to Register */}
          <Link to="/dashboard">Dashboard</Link> {/* Link to User Dashboard */}
          <Link to="/parent-dashboard">Parent Dashboard</Link> {/* Link to Parent Dashboard */}
        </nav>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Set the route for Login */}
          <Route path="/register" element={<Register />} /> {/* Set the route for Register */}
          <Route path="/dashboard" element={<Dashboard parentId={parentId} childId={childId} />} /> {/* Set the route for User Dashboard */}
          <Route path="/parent-dashboard" element={<ParentDashboard parentId={parentId} />} /> {/* Set the route for Parent Dashboard */}
          <Route path="/create-child" element={<CreateChildAccount parentId={parentId} />} /> {/* Route for creating child account */}
          <Route path="/link-child" element={<LinkChildToParent parentId={parentId} />} /> {/* Route for linking child */}
          <Route path="/view-progress" element={<ViewChildProgress parentId={parentId} childId={childId} />} /> {/* Route for viewing child's progress */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
