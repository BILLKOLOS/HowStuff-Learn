import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Import Link for navigation
import Login from './login';  // Import the Login component
import Register from './register'; // Import the Register component
import Dashboard from './dashboard'; // Import the Dashboard component
import CreateChildAccount from './CreateChildAccount'; // Import CreateChildAccount component
import LinkChildToParent from './LinkChildToParent'; // Import LinkChildToParent component
import ViewChildProgress from './ViewChildProgress'; // Import ViewChildProgress component

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
          <Link to="/dashboard">Dashboard</Link> {/* Link to Dashboard */}
        </nav>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Set the route for Login */}
          <Route path="/register" element={<Register />} /> {/* Set the route for Register */}
          <Route path="/dashboard" element={<Dashboard parentId={parentId} childId={childId} />} /> {/* Set the route for Dashboard */}
          <Route path="/create-child" element={<CreateChildAccount parentId={parentId} />} /> {/* Route for creating child account */}
          <Route path="/link-child" element={<LinkChildToParent parentId={parentId} />} /> {/* Route for linking child */}
          <Route path="/view-progress" element={<ViewChildProgress parentId={parentId} childId={childId} />} /> {/* Route for viewing child's progress */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
