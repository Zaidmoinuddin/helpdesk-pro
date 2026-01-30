import App from './App'; // Import your main component
import React from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root')); // Get the root div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
