// --- src/index.js ---
// This is the main entry point for your React application.
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Imports the Tailwind CSS styles
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);