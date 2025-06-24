// src/pages/DigestiveDiagnosisPage.jsx
import React, { useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import Disclaimer from '../components/Disclaimer';
import { diagnoseDigestive } from '../services/api'; // Import the API service function
import { useTranslation } from 'react-i18next'; // Import the translation hook

// Define the initial state for the form data
const initialFormData = {
    // Basic Info
    breed: '', age: '', sex: '', neutered: 'Not Provided', weightInfo: '',
    // Main Complaint & History
    mainComplaint: '', firstNoticed: '', onsetSpeed: 'Gradual', symptomPattern: 'Continuous', progress: 'Stable', previousIssues: 'No',
    // Diet
    mainFood: '', foodSince: '', treats: '', dietChange: 'No', eatingHabits: 'Normal', scavenging: 'No', toyIngestion: 'No', toxinExposure: 'No',
    // Vomiting
    isVomiting: 'No', vomitFrequency: '', vomitTiming: 'Variable', vomitContents: [], vomitEffort: 'Yes',
    // Diarrhea
    isDiarrhea: 'No', diarrheaFrequency: '', diarrheaConsistency: [], diarrheaStraining: 'No', diarrheaAccidents: 'No', diarrheaOdor: 'Normal',
    // Appetite & Thirst
    appetite: 'Normal', thirst: 'Normal',
    // Other GI Symptoms
    borborygmi: 'No', abdominalPain: 'No', flatulence: 'No', lipSmackingDrooling: 'No',
    // General Condition
    lethargy: 'No', fever: 'No', gumColor: 'Pink',
    // Environment & Management
    dewormingStatus: '', vaccinationStatus: 'Up to date', recentStress: 'No', otherPetsAffected: 'No',
    // Previous Treatment
    prevVetVisit: 'No', prevTests: '', prevTreatments: '', prevResponse: 'Unknown',
};


function DigestiveDiagnosisPage() {
    // Call useTranslation without specific namespaces
    const { t } = useTranslation();
    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState(null);

    // Generic change handler (no changes needed)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prevState => ({
                ...prevState,
                [name]: checked
                    ? [...(prevState[name] || []), value]
                    : (prevState[name] || []).filter(item => item !== value)
            }));
        } else {
            setFormData(prevState => ({ ...prevState, [name]: value }));
        }
    };

    // Form submission handler (no changes needed)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAnalysisResult(null);
        setError(null);
        console.log("Submitting Digestive Diagnosis Data:", formData);
        try {
            const data = await diagnoseDigestive(formData);
            console.log("API Response Data:", data);
            setAnalysisResult(data.analysis);
        } catch (err) {
            console.error("API Error caught in component:", err);
            setError(err?.error || err?.message || t('common.apiError')); // Use full path for common error
        } finally {
            setIsLoading(false);
        }
    };

    // *** UPDATED Helper function to render radio buttons ***
    const renderRadioGroup = (labelKey, name, optionsKey) => (
        <div className="form-group">
            <label>{t(labelKey)}</label>
            <div className="radio-group-container">
                {(t(optionsKey, { returnObjects: true, defaultValue: [] })).map(option => (
                    <label key={option.value} style={{ fontWeight: 'normal', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={formData[name] === option.value}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <span style={{ marginLeft: '0.4rem' }}>{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );

     // *** UPDATED Helper function to render checkboxes ***
     const renderCheckboxGroup = (labelKey, name, optionsKey) => (
        <div className="form-group">
            <label>{t(labelKey)}</label>
            <div className="checkbox-grid-container">
                 {(t(optionsKey, { returnObjects: true, defaultValue: [] })).map(option => (
                    <label key={option.value} style={{ fontWeight: 'normal', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            name={name}
                            value={option.value}
                            checked={Array.isArray(formData[name]) && formData[name]?.includes(option.value)}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                         <span style={{ marginLeft: '0.4rem' }}>{option.label}</span>
                    </label>
                 ))}
            </div>
        </div>
    );

    // Main component render with updated t() calls
    return (
        <div className="diagnosis-page container">
            {/* Use full key paths */}
            <h1>{t('digestiveDiagnosisPage.title')}</h1>
            <p>{t('digestiveDiagnosisPage.description')}</p>
            <hr />

            <form onSubmit={handleSubmit}>

                {/* --- Section: Basic Info --- */}
                <h2>{t('digestiveDiagnosisPage.sections.basicInfo')}</h2>
                <div>
                    <label htmlFor="breed">{t('digestiveDiagnosisPage.labels.breed')}</label>
                    <input type="text" id="breed" name="breed" value={formData.breed} onChange={handleChange} disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="age">{t('digestiveDiagnosisPage.labels.age')}</label>
                    <input type="text" id="age" name="age" value={formData.age} onChange={handleChange} disabled={isLoading} />
                </div>
                 <div>
                    <label htmlFor="sex">{t('digestiveDiagnosisPage.labels.sex')}</label>
                    <select id="sex" name="sex" value={formData.sex} onChange={handleChange} disabled={isLoading}>
                        <option value="">{t('common.selectOption')}</option>
                        <option value="Male">{t('digestiveDiagnosisPage.labels.male')}</option>
                        <option value="Female">{t('digestiveDiagnosisPage.labels.female')}</option>
                    </select>
                </div>
                {renderRadioGroup('digestiveDiagnosisPage.labels.neutered', 'neutered', 'digestiveDiagnosisPage.labels.neuteredOptions')}
                 <div>
                    <label htmlFor="weightInfo">{t('digestiveDiagnosisPage.labels.weightInfo')}</label>
                    <input type="text" id="weightInfo" name="weightInfo" placeholder={t('digestiveDiagnosisPage.labels.weightInfoPlaceholder')} value={formData.weightInfo} onChange={handleChange} disabled={isLoading} />
                </div>

                {/* --- Section: Main Complaint & History --- */}
                <h2>{t('digestiveDiagnosisPage.sections.mainComplaintHistory')}</h2>
                 <div>
                    <label htmlFor="mainComplaint">{t('digestiveDiagnosisPage.labels.mainComplaint')} <span style={{color: 'red'}}>*</span></label>
                    <input type="text" id="mainComplaint" name="mainComplaint" value={formData.mainComplaint} onChange={handleChange} disabled={isLoading} required />
                 </div>
                 <div>
                    <label htmlFor="firstNoticed">{t('digestiveDiagnosisPage.labels.firstNoticed')}</label>
                    <input type="text" id="firstNoticed" name="firstNoticed" placeholder={t('digestiveDiagnosisPage.labels.firstNoticedPlaceholder')} value={formData.firstNoticed} onChange={handleChange} disabled={isLoading} />
                 </div>
                {renderRadioGroup('digestiveDiagnosisPage.labels.onsetSpeed', 'onsetSpeed', 'digestiveDiagnosisPage.labels.onsetSpeedOptions')}
                {renderRadioGroup('digestiveDiagnosisPage.labels.symptomPattern', 'symptomPattern', 'digestiveDiagnosisPage.labels.symptomPatternOptions')}
                {renderRadioGroup('digestiveDiagnosisPage.labels.progress', 'progress', 'digestiveDiagnosisPage.labels.progressOptions')}
                {renderRadioGroup('digestiveDiagnosisPage.labels.previousIssues', 'previousIssues', 'digestiveDiagnosisPage.labels.yesNoOptions')}

                {/* --- Section: Diet --- */}
                <h2>{t('digestiveDiagnosisPage.sections.diet')}</h2>
                 <div>
                    <label htmlFor="mainFood">{t('digestiveDiagnosisPage.labels.mainFood')}</label>
                    <input type="text" id="mainFood" name="mainFood" value={formData.mainFood} onChange={handleChange} disabled={isLoading} />
                 </div>
                <div>
                    <label htmlFor="foodSince">{t('digestiveDiagnosisPage.labels.foodSince')}</label>
                    <input type="text" id="foodSince" name="foodSince" placeholder={t('digestiveDiagnosisPage.labels.foodSincePlaceholder')} value={formData.foodSince} onChange={handleChange} disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="treats">{t('digestiveDiagnosisPage.labels.treats')}</label>
                    <textarea id="treats" name="treats" value={formData.treats} onChange={handleChange} disabled={isLoading} />
                </div>
                {renderRadioGroup('digestiveDiagnosisPage.labels.dietChange', 'dietChange', 'digestiveDiagnosisPage.labels.yesNoOptions')}
                {renderRadioGroup('digestiveDiagnosisPage.labels.eatingHabits', 'eatingHabits', 'digestiveDiagnosisPage.labels.eatingHabitsOptions')}
                {renderRadioGroup('digestiveDiagnosisPage.labels.scavenging', 'scavenging', 'digestiveDiagnosisPage.labels.yesNoPossiblyOptions')}
                {renderRadioGroup('digestiveDiagnosisPage.labels.toyIngestion', 'toyIngestion', 'digestiveDiagnosisPage.labels.yesNoPossiblyOptions')}
                {renderRadioGroup('digestiveDiagnosisPage.labels.toxinExposure', 'toxinExposure', 'digestiveDiagnosisPage.labels.yesNoPossiblyOptions')}

                 {/* --- Section: Vomiting --- */}
                <h2>{t('digestiveDiagnosisPage.sections.vomiting')}</h2>
                {renderRadioGroup('digestiveDiagnosisPage.labels.isVomiting', 'isVomiting', 'digestiveDiagnosisPage.labels.yesNoOptions')}
                {formData.isVomiting === 'Yes' && (
                    <>
                        <div>
                            <label htmlFor="vomitFrequency">{t('digestiveDiagnosisPage.labels.vomitFrequency')}</label>
                            <input type="text" id="vomitFrequency" name="vomitFrequency" placeholder={t('digestiveDiagnosisPage.labels.vomitFrequencyPlaceholder')} value={formData.vomitFrequency} onChange={handleChange} disabled={isLoading} />
                        </div>
                        {renderRadioGroup('digestiveDiagnosisPage.labels.vomitTiming', 'vomitTiming', 'digestiveDiagnosisPage.labels.vomitTimingOptions')}
                        {renderCheckboxGroup('digestiveDiagnosisPage.labels.vomitContents', 'vomitContents', 'digestiveDiagnosisPage.labels.vomitContentsOptions')}
                        {renderRadioGroup('digestiveDiagnosisPage.labels.vomitEffort', 'vomitEffort', 'digestiveDiagnosisPage.labels.vomitEffortOptions')}
                    </>
                )}

                {/* --- Section: Diarrhea --- */}
                <h2>{t('digestiveDiagnosisPage.sections.diarrhea')}</h2>
                {renderRadioGroup('digestiveDiagnosisPage.labels.isDiarrhea', 'isDiarrhea', 'digestiveDiagnosisPage.labels.yesNoOptions')}
                 {formData.isDiarrhea === 'Yes' && (
                    <>
                        <div>
                            <label htmlFor="diarrheaFrequency">{t('digestiveDiagnosisPage.labels.diarrheaFrequency')}</label>
                            <input type="text" id="diarrheaFrequency" name="diarrheaFrequency" placeholder={t('digestiveDiagnosisPage.labels.diarrheaFrequencyPlaceholder')} value={formData.diarrheaFrequency} onChange={handleChange} disabled={isLoading} />
                        </div>
                        {renderCheckboxGroup('digestiveDiagnosisPage.labels.diarrheaConsistency', 'diarrheaConsistency', 'digestiveDiagnosisPage.labels.diarrheaConsistencyOptions')}
                        {renderRadioGroup('digestiveDiagnosisPage.labels.diarrheaStraining', 'diarrheaStraining', 'digestiveDiagnosisPage.labels.yesNoOptions')}
                        {renderRadioGroup('digestiveDiagnosisPage.labels.diarrheaAccidents', 'diarrheaAccidents', 'digestiveDiagnosisPage.labels.yesNoOptions')}
                        {renderRadioGroup('digestiveDiagnosisPage.labels.diarrheaOdor', 'diarrheaOdor', 'digestiveDiagnosisPage.labels.diarrheaOdorOptions')}
                    </>
                 )}

                {/* --- Section: Appetite & Thirst --- */}
                <h2>{t('digestiveDiagnosisPage.sections.appetiteThirst')}</h2>
                {renderRadioGroup('digestiveDiagnosisPage.labels.appetite', 'appetite', 'digestiveDiagnosisPage.labels.appetiteOptions')}
                {renderRadioGroup('digestiveDiagnosisPage.labels.thirst', 'thirst', 'digestiveDiagnosisPage.labels.thirstOptions')}

                {/* --- Section: Other GI Symptoms --- */}
                <h2>{t('digestiveDiagnosisPage.sections.otherGISymptoms')}</h2>
                 {renderRadioGroup('digestiveDiagnosisPage.labels.borborygmi', 'borborygmi', 'digestiveDiagnosisPage.labels.borborygmiOptions')}
                 {renderRadioGroup('digestiveDiagnosisPage.labels.abdominalPain', 'abdominalPain', 'digestiveDiagnosisPage.labels.abdominalPainOptions')}
                 {renderRadioGroup('digestiveDiagnosisPage.labels.flatulence', 'flatulence', 'digestiveDiagnosisPage.labels.flatulenceOptions')}
                 {renderRadioGroup('digestiveDiagnosisPage.labels.lipSmackingDrooling', 'lipSmackingDrooling', 'digestiveDiagnosisPage.labels.yesNoOptions')}

                {/* --- Section: General Condition --- */}
                <h2>{t('digestiveDiagnosisPage.sections.generalCondition')}</h2>
                {renderRadioGroup('digestiveDiagnosisPage.labels.lethargy', 'lethargy', 'digestiveDiagnosisPage.labels.lethargyOptions')}
                {renderRadioGroup('digestiveDiagnosisPage.labels.fever', 'fever', 'digestiveDiagnosisPage.labels.feverOptions')}
                 <div>
                    <label htmlFor="gumColor">{t('digestiveDiagnosisPage.labels.gumColor')}</label>
                    <select id="gumColor" name="gumColor" value={formData.gumColor} onChange={handleChange} disabled={isLoading}>
                        {/* Use full key path for options */}
                        {(t('digestiveDiagnosisPage.labels.gumColorOptions', { returnObjects: true, defaultValue: [] })).map(option => (
                             <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                {/* --- Section: Environment & Management --- */}
                <h2>{t('digestiveDiagnosisPage.sections.environmentManagement')}</h2>
                 <div>
                    <label htmlFor="dewormingStatus">{t('digestiveDiagnosisPage.labels.dewormingStatus')}</label>
                    <input type="text" id="dewormingStatus" name="dewormingStatus" placeholder={t('digestiveDiagnosisPage.labels.dewormingPlaceholder')} value={formData.dewormingStatus} onChange={handleChange} disabled={isLoading} />
                 </div>
                {renderRadioGroup('digestiveDiagnosisPage.labels.vaccinationStatus', 'vaccinationStatus', 'digestiveDiagnosisPage.labels.vaccinationOptions')}
                {renderRadioGroup('digestiveDiagnosisPage.labels.recentStress', 'recentStress', 'digestiveDiagnosisPage.labels.yesNoOptions')}
                {renderRadioGroup('digestiveDiagnosisPage.labels.otherPetsAffected', 'otherPetsAffected', 'digestiveDiagnosisPage.labels.yesNoOptions')}


                {/* --- Section: Previous Treatment --- */}
                 <h2>{t('digestiveDiagnosisPage.sections.previousTreatment')}</h2>
                {renderRadioGroup('digestiveDiagnosisPage.labels.prevVetVisit', 'prevVetVisit', 'digestiveDiagnosisPage.labels.yesNoOptions')}
                 {formData.prevVetVisit === 'Yes' && (
                    <>
                        <div>
                            <label htmlFor="prevTests">{t('digestiveDiagnosisPage.labels.prevTests')}</label>
                            <textarea id="prevTests" name="prevTests" placeholder={t('digestiveDiagnosisPage.labels.prevTestsPlaceholder')} value={formData.prevTests} onChange={handleChange} disabled={isLoading} />
                        </div>
                        <div>
                            <label htmlFor="prevTreatments">{t('digestiveDiagnosisPage.labels.prevTreatments')}</label>
                            <textarea id="prevTreatments" name="prevTreatments" placeholder={t('digestiveDiagnosisPage.labels.prevTreatmentsPlaceholder')} value={formData.prevTreatments} onChange={handleChange} disabled={isLoading} />
                        </div>
                        {renderRadioGroup('digestiveDiagnosisPage.labels.prevResponse', 'prevResponse', 'digestiveDiagnosisPage.labels.prevResponseOptions')}
                    </>
                 )}

                <hr />

                {/* --- Submission Button --- */}
                <button type="submit" disabled={isLoading} style={{ minWidth: '150px', marginTop: '1rem' }}>
                    {isLoading ? t('common.analyzing') : t('digestiveDiagnosisPage.getAnalysisButton')}
                </button>

            </form>

            {/* --- Loading State --- */}
            {isLoading && <LoadingSpinner text={t('common.analyzing') + '...'} />}

            {/* --- Error Display --- */}
            {!isLoading && error && (
                <div className="error-message" style={{ marginTop: '1.5rem' }}>
                    <strong>{t('common.errorPrefix')}</strong> {typeof error === 'string' ? error : JSON.stringify(error)}
                </div>
            )}

            {/* --- Results Display --- */}
            {!isLoading && analysisResult && (
                <div className="results-section" style={{ marginTop: '1.5rem' }}>
                    <Disclaimer />
                    <h2>{t('digestiveDiagnosisPage.resultsTitle', 'Analysis Results (AI Suggestions Only)')}</h2> {/* Example fallback */}
                    <pre>
                        {analysisResult}
                    </pre>
                </div>
            )}

        </div>
    );
}

export default DigestiveDiagnosisPage;