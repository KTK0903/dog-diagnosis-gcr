// src/components/Disclaimer.jsx
import React from 'react';
import { useTranslation } from 'react-i18next'; // Import the hook for translations

// Assume styles for the 'disclaimer' class are defined in App.css
// or a dedicated Disclaimer.css file.

/**
 * A reusable component to display an important disclaimer message.
 * Uses i18next with full key paths, assuming no specific namespace is loaded via useTranslation.
 *
 * Props:
 *   className?: string - Optional additional CSS class names to apply to the container div.
 */
function Disclaimer({ className }) {
  // Call useTranslation hook without specifying a namespace.
  // This requires using the full key path when calling t().
  const { t } = useTranslation();

  // Combine the base class with any additional classes passed via props.
  const combinedClassName = `disclaimer ${className || ''}`.trim();

  // --- Safer Alternative using Trans component (Recommended over dangerouslySetInnerHTML) ---
  // Uncomment this section and the import below if you prefer this method.
  // Ensure your translation key for line1 *doesn't* contain HTML tags if using Trans.
  // You would structure your JSON like:
  // "disclaimer": { "title": "...", "line1": "The text part <1>NOT</1> the other part.", "line2": "..." }
  /*
  import { Trans } from 'react-i18next'; // Import Trans component

  return (
    <div className={combinedClassName} role="alert">
      <p>
        <strong>{t('disclaimer.title')}</strong>
        {' '}
        <Trans i18nKey="disclaimer.line1">
          This tool provides AI-generated suggestions based solely on the information you provide. It is <strong style={{ color: '#c0392b' }}>NOT</strong> a substitute for a professional veterinary diagnosis.
        </Trans>
      </p>
      <p>
        {t('disclaimer.line2')}
      </p>
    </div>
  );
  */
  // --- End of Trans component alternative ---


  // --- Original Method using dangerouslySetInnerHTML (Use if line1 translation contains HTML) ---
   return (
     <div className={combinedClassName} role="alert">
       <p>
         {/* Use full key path 'disclaimer.title' */}
         <strong>{t('disclaimer.title')}</strong>
         {' '}
         {/* Use full key path 'disclaimer.line1'. Assumes this translation includes <strong> tag */}
         <span dangerouslySetInnerHTML={{ __html: t('disclaimer.line1') }} />
       </p>
       <p>
         {/* Use full key path 'disclaimer.line2' */}
         {t('disclaimer.line2')}
       </p>
     </div>
   );
   // --- End of dangerouslySetInnerHTML method ---

}

export default Disclaimer;