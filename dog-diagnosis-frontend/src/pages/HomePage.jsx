// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next'; // Import the hook

// Optional: Import specific CSS for this page if created
// import './HomePage.css';

function HomePage() {
  // Call useTranslation hook without specifying a namespace
  // This allows access to all keys using dot notation (e.g., 'homePage.welcome')
  const { t } = useTranslation();

  return (
    // Apply CSS classes for styling
    <div className="home-page">

      {/* Container for the language selector, aligned to the right */}
      <div className="language-selector-container">
        <LanguageSelector />
      </div>

      {/* Welcome Section - Centered Text */}
      <section className="welcome-section">
        {/* Use t() function with the full key path */}
        <h1>{t('homePage.welcome')}</h1>
        {/* Use t() function with the full key path */}
        <p className="description">{t('homePage.description')}</p>
      </section>

      {/* Diagnosis Options Section */}
      <section className="diagnosis-options">
        {/* Button Group for Centering and Spacing */}
        <div className="button-group">
          {/* Link and Button for Skin Diagnosis */}
          <Link to="/diagnose/skin">
            <button className="diagnosis-button skin-button">
              {/* Use t() function with the full key path */}
              {t('homePage.skinButton')}
            </button>
          </Link>

          {/* Link and Button for Digestive Diagnosis */}
          <Link to="/diagnose/digestive">
            <button className="diagnosis-button digestive-button">
              {/* Use t() function with the full key path */}
              {t('homePage.digestiveButton')}
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}

export default HomePage;