// src/components/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css'; // Import the CSS for styling

/**
 * A simple loading spinner component.
 * Optionally accepts a 'text' prop to display below the spinner.
 */
function LoadingSpinner({ text }) {
  return (
    <div className="spinner-container" role="status" aria-live="polite"> {/* Role for accessibility */}
      <div className="loading-spinner"></div>
      {text && <p className="loading-text">{text}</p>} {/* Conditionally render text */}
    </div>
  );
}

// Add default props for flexibility
LoadingSpinner.defaultProps = {
    text: 'Loading...' // Default text if none is provided
};

export default LoadingSpinner;