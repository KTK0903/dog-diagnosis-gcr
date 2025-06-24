// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // To link back to the home page
import { useTranslation } from 'react-i18next'; // Import the hook for translations

// Optional: Define inline styles or use a separate CSS file
const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 'calc(100vh - 150px)', // Adjust height based on potential header/footer
  textAlign: 'center',
  padding: '2rem',
};

const headingStyle = {
  fontSize: 'clamp(2rem, 10vw, 5rem)', // Responsive font size
  color: '#bdc3c7', // Muted grey color
  margin: '0 0 1rem 0',
};

const messageStyle = {
  fontSize: '1.2rem',
  color: '#7f8c8d', // Lighter text color
  marginBottom: '2rem',
};

const linkStyle = {
  display: 'inline-block',
  padding: '10px 20px',
  backgroundColor: '#3498db', // Use primary color (consistent with App.css potentially)
  color: '#fff',
  borderRadius: '5px',
  textDecoration: 'none',
  fontWeight: 'bold',
  transition: 'background-color 0.2s ease',
};

function NotFoundPage() {
  // Call useTranslation hook without specifying a namespace
  // This allows access to all keys using dot notation (e.g., 'notFoundPage.title')
  const { t } = useTranslation();

  return (
    <div style={pageStyle}>
      {/* Use t() function with the full key path */}
      <h1 style={headingStyle}>{t('notFoundPage.title')}</h1>
      <p style={messageStyle}>
        {/* Use t() function with the full key path */}
        {t('notFoundPage.message')}
      </p>
      <Link to="/" style={linkStyle}>
        {/* Use t() function with the full key path */}
        {t('notFoundPage.goHome')}
      </Link>
    </div>
  );
}

export default NotFoundPage;