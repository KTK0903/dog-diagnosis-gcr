// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client'; // Use the client renderer
import App from './App.jsx';             // Your main App component

// Import global CSS (ensure your main styles are loaded)
import './index.css'; // Vite's default or your primary global CSS
// Or import App.css if that holds all global styles:
// import './App.css';

// Import the i18next configuration file to initialize it
// This line MUST run before your App component renders to make i18n available
import './i18n';

// Get the root DOM element from index.html
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element'); // Basic check

// Create the React root using the new API
const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    {/* StrictMode helps find potential problems */}

    {/* App component contains the BrowserRouter and Routes */}
    <App />

    {/* LanguageProvider is no longer needed here as i18next handles it */}

  </React.StrictMode>
);