import React from 'react';
import ReactDOM from 'react-dom/client'; // Import for React 18+
import App from './App'; // Import the main App component
import './css/styles.css'; // Import the CSS for styling

// Get the root DOM element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component into the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);