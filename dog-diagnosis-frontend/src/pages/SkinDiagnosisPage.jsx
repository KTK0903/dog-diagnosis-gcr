import React, { useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import Disclaimer from '../components/Disclaimer';
import { diagnoseSkin } from '../services/api';
import { useTranslation } from 'react-i18next';

// Define the initial state for the form data
// Keys should match exactly what the backend/gemini prompt expects
const initialFormData = {
    // Basic Info
    breed: '', age: '', sex: '', neutered: 'Not Provided',
    // Main Complaint & History
    mainComplaint: '', firstNoticed: '', onsetSpeed: 'Gradual', initialLocation: '', spread: 'No',
    currentLocation: '', symmetry: 'No', previousIssues: 'No', seasonality: 'No', progress: 'Stable',
    // Itchiness
    isItchy: 'No', pruritusScore: '1', itchMethod: [], itchLocation: '', itchLesionOnset: 'Lesions First',
    steroidResponse: 'Unknown', apoquelResponse: 'Unknown',
    // Lesion Characteristics
    lesionTypes: [], skinTexture: '', odor: 'No',
    // Environment & Management
    indoorOutdoor: 'Indoor', walkEnvironment: '', envChanges: 'No', groomingFreq: '', shampoo: '',
    bedding: '', contactIrritants: 'No',
    // Diet
    mainFood: '', foodSince: '', treats: '', dietChange: 'No', rxDietTrial: 'No', giSymptoms: 'No',
    // Parasite Control
    parasiteControlActive: 'No', parasiteProduct: '', parasiteFrequency: '', parasiteLastDate: '', fleaTickSeen: 'No',
    // Contagion
    otherPetsAffected: 'No', humansAffected: 'No',
    // General Health
    otherSymptoms: '', preexistingConditions: '', currentMeds: '', vaccinationStatus: 'Up to date',
    // Previous Treatment
    prevVetVisit: 'No', prevTests: '', prevTreatments: '', prevResponse: 'Unknown',
};

function SkinDiagnosisPage() {
    // Load translations from all relevant namespaces
    const { t } = useTranslation(); // Load default namespace + any explicitly loaded in i18n.js
    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState(null);

    // Generic change handler for form inputs
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

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAnalysisResult(null);
        setError(null);
        console.log("Submitting Skin Diagnosis Data:", formData);
        try {
            const data = await diagnoseSkin(formData);
            console.log("API Response Data:", data);
            setAnalysisResult(data.analysis);
        } catch (err) {
            console.error("API Error caught in component:", err);
            setError(err?.error || err?.message || t('common.apiError'));
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to render radio buttons using full translation keys
    const renderRadioGroup = (labelKey, name, optionsKey) => (
        <div className="form-group">
            <label>{t(labelKey)}</label>
            <div className="radio-group-container">
                {(t(optionsKey, { returnObjects: true, defaultValue: [] })).map(option => (
                    <label key={option.value} style={{ fontWeight: 'normal', display: 'flex', alignItems: 'center', cursor: isLoading ? 'default' : 'pointer' }}>
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={formData[name] === option.value}
                            onChange={handleChange}
                            disabled={isLoading}
                            style={{ cursor: isLoading ? 'default' : 'pointer' }}
                        />
                        <span style={{ marginLeft: '0.4rem' }}>{option.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );

     // Helper to render checkboxes using full translation keys
     const renderCheckboxGroup = (labelKey, name, optionsKey) => (
        <div className="form-group">
            <label>{t(labelKey)}</label>
            <div className="checkbox-grid-container">
                 {(t(optionsKey, { returnObjects: true, defaultValue: [] })).map(option => (
                    <label key={option.value} style={{ fontWeight: 'normal', display: 'flex', alignItems: 'center', cursor: isLoading ? 'default' : 'pointer' }}>
                        <input
                            type="checkbox"
                            name={name}
                            value={option.value}
                            checked={Array.isArray(formData[name]) && formData[name]?.includes(option.value)}
                            onChange={handleChange}
                            disabled={isLoading}
                            style={{ cursor: isLoading ? 'default' : 'pointer' }}
                        />
                         <span style={{ marginLeft: '0.4rem' }}>{option.label}</span>
                    </label>
                 ))}
            </div>
        </div>
    );

    // Main component render
    return (
        <div className="diagnosis-page container">
            <h1>{t('skinDiagnosisPage.title')}</h1>
            <p>{t('skinDiagnosisPage.description')}</p>
            <hr />

            <form onSubmit={handleSubmit}>

                {/* --- Section: Basic Info --- */}
                <h2>{t('skinDiagnosisPage.sections.basicInfo')}</h2>
                <div>
                    <label htmlFor="breed">{t('skinDiagnosisPage.labels.breed')}</label>
                    <input type="text" id="breed" name="breed" value={formData.breed} onChange={handleChange} disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="age">{t('skinDiagnosisPage.labels.age')}</label>
                    <input type="text" id="age" name="age" value={formData.age} onChange={handleChange} disabled={isLoading} />
                </div>
                 <div>
                    <label htmlFor="sex">{t('skinDiagnosisPage.labels.sex')}</label>
                    <select id="sex" name="sex" value={formData.sex} onChange={handleChange} disabled={isLoading}>
                        <option value="">{t('common.selectOption')}</option>
                        <option value="Male">{t('skinDiagnosisPage.labels.male')}</option>
                        <option value="Female">{t('skinDiagnosisPage.labels.female')}</option>
                    </select>
                </div>
                {renderRadioGroup('skinDiagnosisPage.labels.neutered', 'neutered', 'skinDiagnosisPage.labels.neuteredOptions')}


                {/* --- Section: Main Complaint & History --- */}
                <h2>{t('skinDiagnosisPage.sections.mainComplaintHistory')}</h2>
                 <div>
                    <label htmlFor="mainComplaint">{t('skinDiagnosisPage.labels.mainComplaint')} <span style={{color: 'red'}}>*</span></label>
                    <input type="text" id="mainComplaint" name="mainComplaint" value={formData.mainComplaint} onChange={handleChange} disabled={isLoading} required />
                 </div>
                 <div>
                    <label htmlFor="firstNoticed">{t('skinDiagnosisPage.labels.firstNoticed')}</label>
                    <input type="text" id="firstNoticed" name="firstNoticed" placeholder={t('skinDiagnosisPage.labels.firstNoticedPlaceholder')} value={formData.firstNoticed} onChange={handleChange} disabled={isLoading} />
                 </div>
                {renderRadioGroup('skinDiagnosisPage.labels.onsetSpeed', 'onsetSpeed', 'skinDiagnosisPage.labels.onsetSpeedOptions')}
                 <div>
                    <label htmlFor="initialLocation">{t('skinDiagnosisPage.labels.initialLocation')}</label>
                    <input type="text" id="initialLocation" name="initialLocation" value={formData.initialLocation} onChange={handleChange} disabled={isLoading} />
                 </div>
                 <div>
                    <label htmlFor="currentLocation">{t('skinDiagnosisPage.labels.currentLocation')}</label>
                    <textarea id="currentLocation" name="currentLocation" value={formData.currentLocation} onChange={handleChange} disabled={isLoading} />
                 </div>
                {renderRadioGroup('skinDiagnosisPage.labels.spread', 'spread', 'skinDiagnosisPage.labels.yesNoOptions')}
                {renderRadioGroup('skinDiagnosisPage.labels.symmetry', 'symmetry', 'skinDiagnosisPage.labels.symmetryOptions')}
                {renderRadioGroup('skinDiagnosisPage.labels.previousIssues', 'previousIssues', 'skinDiagnosisPage.labels.yesNoOptions')}
                {renderRadioGroup('skinDiagnosisPage.labels.seasonality', 'seasonality', 'skinDiagnosisPage.labels.yesNoOptions')}
                {renderRadioGroup('skinDiagnosisPage.labels.progress', 'progress', 'skinDiagnosisPage.labels.progressOptions')}


                {/* --- Section: Itchiness --- */}
                <h2>{t('skinDiagnosisPage.sections.itchiness')}</h2>
                {renderRadioGroup('skinDiagnosisPage.labels.isItchy', 'isItchy', 'skinDiagnosisPage.labels.yesNoOptions')}
                {formData.isItchy === 'Yes' && (
                 <>
                    <div>
                        <label htmlFor="pruritusScore">{t('skinDiagnosisPage.labels.pruritusScore')}</label>
                        <select id="pruritusScore" name="pruritusScore" value={formData.pruritusScore} onChange={handleChange} disabled={isLoading}>
                            {[...Array(10).keys()].map(i => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                        </select>
                    </div>
                    {renderCheckboxGroup('skinDiagnosisPage.labels.itchMethod', 'itchMethod', 'skinDiagnosisPage.labels.itchMethodOptions')}
                    <div>
                        <label htmlFor="itchLocation">{t('skinDiagnosisPage.labels.itchLocation')}</label>
                        <textarea id="itchLocation" name="itchLocation" value={formData.itchLocation} onChange={handleChange} disabled={isLoading} />
                    </div>
                    {renderRadioGroup('skinDiagnosisPage.labels.itchLesionOnset', 'itchLesionOnset', 'skinDiagnosisPage.labels.itchLesionOnsetOptions')}
                    <div className="form-group">
                        <label>{t('skinDiagnosisPage.labels.pastItchMedication')}</label>
                         {renderRadioGroup('skinDiagnosisPage.labels.steroids', 'steroidResponse', 'skinDiagnosisPage.labels.responseOptions')}
                         {renderRadioGroup('skinDiagnosisPage.labels.apoquelCytopoint', 'apoquelResponse', 'skinDiagnosisPage.labels.responseOptions')}
                    </div>
                 </>
                )}


                {/* --- Section: Lesion Characteristics --- */}
                 <h2>{t('skinDiagnosisPage.sections.lesionCharacteristics')}</h2>
                 {renderCheckboxGroup('skinDiagnosisPage.labels.lesionTypes', 'lesionTypes', 'skinDiagnosisPage.labels.lesionTypeOptions')}
                <div>
                    <label htmlFor="skinTexture">{t('skinDiagnosisPage.labels.skinTexture')}</label>
                    <input type="text" id="skinTexture" name="skinTexture" value={formData.skinTexture} onChange={handleChange} disabled={isLoading} />
                </div>
                {renderRadioGroup('skinDiagnosisPage.labels.odor', 'odor', 'skinDiagnosisPage.labels.yesNoOptions')}


                {/* --- Section: Environment & Management --- */}
                <h2>{t('skinDiagnosisPage.sections.environmentManagement')}</h2>
                {renderRadioGroup('skinDiagnosisPage.labels.indoorOutdoor', 'indoorOutdoor', 'skinDiagnosisPage.labels.indoorOutdoorOptions')}
                <div>
                    <label htmlFor="walkEnvironment">{t('skinDiagnosisPage.labels.walkEnvironment')}</label>
                    <input type="text" id="walkEnvironment" name="walkEnvironment" value={formData.walkEnvironment} onChange={handleChange} disabled={isLoading} />
                </div>
                {renderRadioGroup('skinDiagnosisPage.labels.envChanges', 'envChanges', 'skinDiagnosisPage.labels.yesNoOptions')}
                <div>
                    <label htmlFor="groomingFreq">{t('skinDiagnosisPage.labels.groomingFreq')}</label>
                    <input type="text" id="groomingFreq" name="groomingFreq" value={formData.groomingFreq} onChange={handleChange} disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="shampoo">{t('skinDiagnosisPage.labels.shampoo')}</label>
                    <input type="text" id="shampoo" name="shampoo" value={formData.shampoo} onChange={handleChange} disabled={isLoading} />
                </div>
                 <div>
                    <label htmlFor="bedding">{t('skinDiagnosisPage.labels.bedding')}</label>
                    <input type="text" id="bedding" name="bedding" value={formData.bedding} onChange={handleChange} disabled={isLoading} />
                </div>
                {/* Assuming yesNoPossiblyOptions exists for contactIrritants */}
                {renderRadioGroup('skinDiagnosisPage.labels.contactIrritants', 'contactIrritants', 'skinDiagnosisPage.labels.yesNoPossiblyOptions')}


                {/* --- Section: Diet --- */}
                <h2>{t('skinDiagnosisPage.sections.diet')}</h2>
                <div>
                    <label htmlFor="mainFood">{t('skinDiagnosisPage.labels.mainFood')}</label>
                    <input type="text" id="mainFood" name="mainFood" value={formData.mainFood} onChange={handleChange} disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="foodSince">{t('skinDiagnosisPage.labels.foodSince')}</label>
                    <input type="text" id="foodSince" name="foodSince" placeholder={t('skinDiagnosisPage.labels.foodSincePlaceholder')} value={formData.foodSince} onChange={handleChange} disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="treats">{t('skinDiagnosisPage.labels.treats')}</label>
                    <textarea id="treats" name="treats" value={formData.treats} onChange={handleChange} disabled={isLoading} />
                </div>
                {renderRadioGroup('skinDiagnosisPage.labels.dietChange', 'dietChange', 'skinDiagnosisPage.labels.yesNoOptions')}
                {renderRadioGroup('skinDiagnosisPage.labels.rxDietTrial', 'rxDietTrial', 'skinDiagnosisPage.labels.yesNoOptions')}
                {renderRadioGroup('skinDiagnosisPage.labels.giSymptoms', 'giSymptoms', 'skinDiagnosisPage.labels.yesNoOptions')}


                 {/* --- Section: Parasite Control --- */}
                <h2>{t('skinDiagnosisPage.sections.parasiteControl')}</h2>
                {renderRadioGroup('skinDiagnosisPage.labels.parasiteControlActive', 'parasiteControlActive', 'skinDiagnosisPage.labels.yesNoOptions')}
                 {formData.parasiteControlActive === 'Yes' && (
                    <>
                        <div>
                            <label htmlFor="parasiteProduct">{t('skinDiagnosisPage.labels.parasiteProduct')}</label>
                            <input type="text" id="parasiteProduct" name="parasiteProduct" value={formData.parasiteProduct} onChange={handleChange} disabled={isLoading} />
                        </div>
                         <div>
                            <label htmlFor="parasiteFrequency">{t('skinDiagnosisPage.labels.parasiteFrequency')}</label>
                            <input type="text" id="parasiteFrequency" name="parasiteFrequency" placeholder={t('common.exampleFrequency', '')} value={formData.parasiteFrequency} onChange={handleChange} disabled={isLoading} />
                        </div>
                         <div>
                            <label htmlFor="parasiteLastDate">{t('skinDiagnosisPage.labels.parasiteLastDate')}</label>
                            <input type="text" id="parasiteLastDate" name="parasiteLastDate" placeholder={t('common.exampleDate', '')} value={formData.parasiteLastDate} onChange={handleChange} disabled={isLoading} />
                        </div>
                    </>
                 )}
                 {renderRadioGroup('skinDiagnosisPage.labels.fleaTickSeen', 'fleaTickSeen', 'skinDiagnosisPage.labels.yesNoOptions')}


                {/* --- Section: Contagion --- */}
                <h2>{t('skinDiagnosisPage.sections.contagion')}</h2>
                {renderRadioGroup('skinDiagnosisPage.labels.otherPetsAffected', 'otherPetsAffected', 'skinDiagnosisPage.labels.yesNoOptions')}
                {renderRadioGroup('skinDiagnosisPage.labels.humansAffected', 'humansAffected', 'skinDiagnosisPage.labels.yesNoOptions')}


                {/* --- Section: General Health --- */}
                <h2>{t('skinDiagnosisPage.sections.generalHealth')}</h2>
                 <div>
                    <label htmlFor="otherSymptoms">{t('skinDiagnosisPage.labels.otherSymptoms')}</label>
                    <textarea id="otherSymptoms" name="otherSymptoms" value={formData.otherSymptoms} onChange={handleChange} disabled={isLoading} />
                </div>
                 <div>
                    <label htmlFor="preexistingConditions">{t('skinDiagnosisPage.labels.preexistingConditions')}</label>
                    <textarea id="preexistingConditions" name="preexistingConditions" value={formData.preexistingConditions} onChange={handleChange} disabled={isLoading} />
                </div>
                 <div>
                    <label htmlFor="currentMeds">{t('skinDiagnosisPage.labels.currentMeds')}</label>
                    <textarea id="currentMeds" name="currentMeds" value={formData.currentMeds} onChange={handleChange} disabled={isLoading} />
                </div>
                {renderRadioGroup('skinDiagnosisPage.labels.vaccinationStatus', 'vaccinationStatus', 'skinDiagnosisPage.labels.vaccinationOptions')}


                {/* --- Section: Previous Treatment --- */}
                <h2>{t('skinDiagnosisPage.sections.previousTreatment')}</h2>
                {renderRadioGroup('skinDiagnosisPage.labels.prevVetVisit', 'prevVetVisit', 'skinDiagnosisPage.labels.yesNoOptions')}
                 {formData.prevVetVisit === 'Yes' && (
                    <>
                        <div>
                            <label htmlFor="prevTests">{t('skinDiagnosisPage.labels.prevTests')}</label>
                            <textarea id="prevTests" name="prevTests" placeholder={t('skinDiagnosisPage.labels.prevTestsPlaceholder')} value={formData.prevTests} onChange={handleChange} disabled={isLoading} />
                        </div>
                        <div>
                            <label htmlFor="prevTreatments">{t('skinDiagnosisPage.labels.prevTreatments')}</label>
                            <textarea id="prevTreatments" name="prevTreatments" placeholder={t('skinDiagnosisPage.labels.prevTreatmentsPlaceholder')} value={formData.prevTreatments} onChange={handleChange} disabled={isLoading} />
                        </div>
                        {renderRadioGroup('skinDiagnosisPage.labels.prevResponse', 'prevResponse', 'skinDiagnosisPage.labels.prevResponseOptions')}
                    </>
                 )}
                {/* --- END OF FORM SECTIONS --- */}

                <hr />

                {/* --- Submission Button --- */}
                <button type="submit" disabled={isLoading} style={{ minWidth: '150px', marginTop: '1rem' }}>
                    {isLoading ? t('common.analyzing') : t('skinDiagnosisPage.getAnalysisButton')}
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
                    {/* Use translation key for results title, with fallback */}
                    <h2>{t('skinDiagnosisPage.resultsTitle', 'Analysis Results (AI Suggestions Only)')}</h2>
                    <pre>
                        {analysisResult}
                    </pre>
                </div>
            )}

        </div>
    );
}

export default SkinDiagnosisPage;