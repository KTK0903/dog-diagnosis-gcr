// src/components/LanguageSelector.jsx
import React from 'react';
// REMOVED: import { useLanguage } from '../contexts/LanguageContext'; // No longer using context directly for language change
import { useTranslation } from 'react-i18next'; // Import the hook from react-i18next

// Define the languages you support, matching the keys in i18n.js resources
const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'ko', name: '한국어' },
    { code: 'ja', name: '日本語' }, 
    { code: 'es', name: 'Español' } 
    // Add more languages here if needed
];

function LanguageSelector() {
    // Get the i18n instance and t function from the hook
    // i18n.language contains the current language code (e.g., 'en', 'ko')
    // i18n.changeLanguage(lng) is the function to change the language
    const { i18n } = useTranslation();

    // Handler function to call when the select value changes
    const handleLanguageChange = (event) => {
        const newLanguage = event.target.value;
        i18n.changeLanguage(newLanguage); // Use i18next's function to change language
        // i18next configured with LanguageDetector and localStorage caching
        // will automatically handle saving the preference.
    };

    // Optional: Get the translation function 't' if you want to translate the label itself
    // const { t } = useTranslation('common'); // Assuming 'language' key is in 'common' namespace

    return (
        <div className="language-selector"> {/* Optional wrapper div for styling */}
            {/* Add a label for accessibility */}
            <label htmlFor="language-select" style={{ marginRight: '0.5em' }}>
                {/* Translate the label using i18next if desired, otherwise keep simple */}
                {/* {t('language')} */}
                {/* Simple label based on current lang, or just "Language:" */}
                 {i18n.language === 'ko' ? '언어:' : i18n.language === 'ja' ? '言語:' : i18n.language === 'es' ? 'Idioma:' : 'Language:'}
            </label>
            <select
                id="language-select"
                value={i18n.language} // Use i18n.language to get the current language
                onChange={handleLanguageChange} // Call handler when selection changes
                aria-label="Select language" // Accessibility label
            >
                {/* Map over the available languages to create <option> elements */}
                {availableLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name} {/* Display the language name */}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default LanguageSelector;