import React, { useState } from 'react';
import Login from './login';  // Import the Login component
import Register from './register'; // Import the Register component

const App = () => {
  // Manage the state to toggle between login and register
  const [showLogin, setShowLogin] = useState(true);

  // Function to toggle between Login and Register components
  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="app-container">
      <h1>Welcome to HowStuff & Learn</h1>
      {/* Display either Login or Register based on the current state */}
      {showLogin ? <Login /> : <Register />}

      {/* Button to switch between forms */}
      <button onClick={toggleForm}>
        {showLogin ? 'Go to Register' : 'Go to Login'}
      </button>
    </div>
  );
};

export default App;
