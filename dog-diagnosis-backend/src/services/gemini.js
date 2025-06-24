// backend/src/services/gemini.js

// 1. 필수 모듈 임포트
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
require('dotenv').config(); // .env 파일 로드

// 2. Gemini 클라이언트 초기화 및 API 키 확인
if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is not defined in the .env file.");
    throw new Error("Server configuration error: Gemini API Key is missing.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. 진단 타입 및 사용자 언어에 따른 프롬프트 생성 로직
function createPrompt(formData, diagnosisType, userLanguage = 'en') { // 기본 언어 'en' 설정
    console.log(`Creating prompt for type: ${diagnosisType}, language: ${userLanguage}`);

    // --- 기본 언어 이름 매핑 (Gemini에게 전달할 언어 이름) ---
    let targetLanguageName = 'English';
    if (userLanguage === 'ko') {
        targetLanguageName = 'Korean';
    } else if (userLanguage === 'ja') {
        targetLanguageName = 'Japanese';
    } else if (userLanguage === 'es') {
        targetLanguageName = 'Spanish';
    }
    console.log(`Target language for response: ${targetLanguageName}`);

    // --- 공통 프롬프트 구조 ---
    let promptHeader = `You are a veterinary assistant AI. Analyze the following pet owner's report based *only* on the information provided.
Your task is to suggest the top 3 most likely differential diagnoses (possible conditions) in descending order of likelihood.
For each suggested condition, provide the name of the condition. Include descriptions, reasoning, or treatment advice also.
Crucially, *before* the list, you *must* include a clear disclaimer stating this is an AI result, not a diagnosis, and a vet visit is essential.
**IMPORTANT: Provide the disclaimer and the list of disease names translated into ${targetLanguageName}.**

Example Output Format (in ${targetLanguageName}):
Disclaimer: [Disclaimer text in ${targetLanguageName}]
1. [Condition Name One in ${targetLanguageName}]
    a.**Description:** [Brief description in ${targetLanguageName}]
    b.**General Approaches:** [List of general categories in ${targetLanguageName}]
2. [Condition Name Two in ${targetLanguageName}]
    a.**Description:** [Brief description in ${targetLanguageName}]
    b.**General Approaches:** [List of general categories in ${targetLanguageName}]
3. [Condition Name Three in ${targetLanguageName}]
    a.**Description:** [Brief description in ${targetLanguageName}]
    b.**General Approaches:** [List of general categories in ${targetLanguageName}]

Below is the owner's report (provided in English):
--- Owner's Report Start ---
`;

    let promptBody = ''; // 내용 부분 초기화
    let promptFooter = `
--- Owner's Report End ---

Based *only* on the information provided above, provide the top 3 most likely differential diagnoses in the specified format (Disclaimer + numbered list of names only). **Remember to translate the output (disclaimer and disease names) into ${targetLanguageName}.**`;

    // --- 기본 정보 (공통) ---
    promptBody += `
Basic Information:
- Breed: ${formData.breed || 'Not provided'}
- Age: ${formData.age || 'Not provided'}
- Sex: ${formData.sex || 'Not provided'} (Neutered: ${formData.neutered || 'Not Provided'})
- Weight Information: ${formData.weightInfo || 'Not provided'}
`;

    // --- 타입별 정보 추가 (영어로 제공) ---
    if (diagnosisType === 'skin') {
        promptHeader = promptHeader.replace('condition', 'skin condition');

        promptBody += `
Main Symptoms & History (Skin):
- Primary Problem: ${formData.mainComplaint || 'Not provided'}
- First Noticed: ${formData.firstNoticed || 'Not provided'}
- Onset Speed: ${formData.onsetSpeed || 'Not provided'}
- Initial Location: ${formData.initialLocation || 'Not provided'}
- Has it spread?: ${formData.spread || 'Not provided'}
- Current Location(s): ${formData.currentLocation || 'Not provided'}
- Symmetrical?: ${formData.symmetry || 'Not provided'}
- Previous similar skin issues?: ${formData.previousIssues || 'Not provided'}
- Seasonal?: ${formData.seasonality || 'Not provided'}
- Overall progress?: ${formData.progress || 'Not provided'}

Itchiness (Pruritus):
- Is the dog itchy?: ${formData.isItchy || 'Not provided'}
- Itch Score (1-10): ${formData.pruritusScore || 'Not provided'}
- How dog shows itchiness: ${formData.itchMethod?.join(', ') || 'Not specified'}
- Main Itchy Location(s): ${formData.itchLocation || 'Not provided'}
- Itch vs Lesion Onset: ${formData.itchLesionOnset || 'Not provided'}
- Steroid Response: ${formData.steroidResponse || 'Not provided'}
- Apoquel/Cytopoint Response: ${formData.apoquelResponse || 'Not provided'}

Lesion Characteristics:
- Observed Lesion Types: ${formData.lesionTypes?.join(', ') || 'Not specified'}
- Skin Texture: ${formData.skinTexture || 'Not provided'}
- Odor?: ${formData.odor || 'Not provided'}

Environment & Management:
- Living Area: ${formData.indoorOutdoor || 'Not provided'}
- Walk Environment: ${formData.walkEnvironment || 'Not provided'}
- Recent Env. Changes?: ${formData.envChanges || 'Not provided'}
- Grooming/Bathing Freq: ${formData.groomingFreq || 'Not provided'}
- Shampoo Used: ${formData.shampoo || 'Not provided'}
- Bedding Info: ${formData.bedding || 'Not provided'}
- Contact Irritants?: ${formData.contactIrritants || 'Not provided'}

Diet (Skin Context):
- Main Food: ${formData.mainFood || 'Not provided'} (Since: ${formData.foodSince || 'N/A'})
- Treats/Other: ${formData.treats || 'Not provided'}
- Recent Diet Change?: ${formData.dietChange || 'Not provided'}
- Rx Diet Trial?: ${formData.rxDietTrial || 'Not provided'}
- Concurrent GI Symptoms?: ${formData.giSymptoms || 'Not provided'}

Parasite Control:
- Regular Ectoparasite Prevention?: ${formData.parasiteControlActive || 'Not provided'}
- Product(s): ${formData.parasiteProduct || 'Not provided'}
- Frequency: ${formData.parasiteFrequency || 'Not provided'}
- Last Dose: ${formData.parasiteLastDate || 'Not provided'}
- Fleas/Ticks Seen?: ${formData.fleaTickSeen || 'Not provided'}

Contagion:
- Other Pets Affected?: ${formData.otherPetsAffected || 'Not provided'}
- Humans Affected (Skin)?: ${formData.humansAffected || 'Not provided'}

General Health:
- Other Symptoms Noted: ${formData.otherSymptoms || 'Not provided'}
- Pre-existing Conditions: ${formData.preexistingConditions || 'Not provided'}
- Current Medications: ${formData.currentMeds || 'Not provided'}
- Vaccination Status: ${formData.vaccinationStatus || 'Not provided'}

Previous Treatment (Skin Issue):
- Previous Vet Visit?: ${formData.prevVetVisit || 'Not provided'}
- Previous Tests: ${formData.prevTests || 'Not provided'}
- Previous Treatments: ${formData.prevTreatments || 'Not provided'}
- Response to Treatment: ${formData.prevResponse || 'Not provided'}
`;

    } else if (diagnosisType === 'digestive') {
        promptHeader = promptHeader.replace('condition', 'digestive condition');

        promptBody += `
Main Symptoms & History (Digestive):
- Primary Problem: ${formData.mainComplaint || 'Not provided'}
- First Noticed: ${formData.firstNoticed || 'Not provided'}
- Onset Speed: ${formData.onsetSpeed || 'Not provided'}
- Symptom Pattern: ${formData.symptomPattern || 'Not provided'}
- Overall progress?: ${formData.progress || 'Not provided'}
- Previous similar digestive issues?: ${formData.previousIssues || 'Not provided'}

Diet (Very Important):
- Main Food: ${formData.mainFood || 'Not provided'} (Since: ${formData.foodSince || 'N/A'})
- Treats/Other: ${formData.treats || 'Not provided'}
- Recent Diet Change?: ${formData.dietChange || 'Not provided'}
- Eating Habits: ${formData.eatingHabits || 'Not provided'}
- Scavenging?: ${formData.scavenging || 'Not provided'}
- Toy/Object Ingestion?: ${formData.toyIngestion || 'Not provided'}
- Toxin Exposure?: ${formData.toxinExposure || 'Not provided'}

Vomiting:
- Is the dog vomiting?: ${formData.isVomiting || 'Not provided'}
- Vomit Frequency: ${formData.vomitFrequency || 'Not provided'}
- Vomit Timing: ${formData.vomitTiming || 'Not provided'}
- Vomit Contents: ${formData.vomitContents?.join(', ') || 'Not specified'}
- Effort Involved (Heaving)?: ${formData.vomitEffort || 'Not provided'}

Diarrhea:
- Does the dog have diarrhea?: ${formData.isDiarrhea || 'Not provided'}
- Diarrhea Frequency: ${formData.diarrheaFrequency || 'Not provided'}
- Diarrhea Consistency: ${formData.diarrheaConsistency?.join(', ') || 'Not specified'}
- Straining to Defecate?: ${formData.diarrheaStraining || 'Not provided'}
- Accidents in House?: ${formData.diarrheaAccidents || 'Not provided'}
- Odor Unusually Foul?: ${formData.diarrheaOdor || 'Not provided'}

Appetite & Thirst:
- Current Appetite?: ${formData.appetite || 'Not provided'}
- Water Intake?: ${formData.thirst || 'Not provided'}

Other Digestive Symptoms:
- Loud Gut Sounds?: ${formData.borborygmi || 'Not provided'}
- Signs of Abdominal Pain?: ${formData.abdominalPain || 'Not provided'}
- Increased Gas?: ${formData.flatulence || 'Not provided'}
- Lip Smacking/Drooling?: ${formData.lipSmackingDrooling || 'Not provided'}

General Condition:
- Lethargic?: ${formData.lethargy || 'Not provided'}
- Feverish?: ${formData.fever || 'Not provided'}
- Gum Color: ${formData.gumColor || 'Not provided'}

Environment & Management (Digestive Context):
- Deworming Status: ${formData.dewormingStatus || 'Not provided'}
- Vaccination Status (esp. Parvo): ${formData.vaccinationStatus || 'Not provided'}
- Recent Stress?: ${formData.recentStress || 'Not provided'}
- Other Pets Affected (GI)?: ${formData.otherPetsAffected || 'Not provided'}

Previous Treatment (Digestive Issue):
- Previous Vet Visit?: ${formData.prevVetVisit || 'Not provided'}
- Previous Tests: ${formData.prevTests || 'Not provided'}
- Previous Treatments: ${formData.prevTreatments || 'Not provided'}
- Response to Treatment: ${formData.prevResponse || 'Not provided'}
`;
    } else {
        console.error("Invalid diagnosis type provided to createPrompt:", diagnosisType);
        throw new Error(`Invalid diagnosis type '${diagnosisType}' received.`);
    }

    return promptHeader + promptBody + promptFooter;
}


// 4. 메인 분석 함수 (이제 userLanguage 를 받도록 수정)
async function analyzeSymptoms(formData, diagnosisType) {
    // 프론트엔드에서 전달된 언어 코드 추출 (기본값 'en')
    // ** 중요: formData 객체에 userLanguage 키가 포함되어야 함! **
    const userLanguage = formData.userLanguage || 'en';

    // 사용할 Gemini 모델 선택
    const modelName = "gemini-1.5-flash"; // 또는 gemini-pro 등
    console.log(`[${new Date().toISOString()}] Using Gemini model: ${modelName} for ${diagnosisType} diagnosis in ${userLanguage}`);
    const model = genAI.getGenerativeModel({ model: modelName });

    // 타입 및 언어에 맞는 프롬프트 생성
    let promptInput;
    try {
      // userLanguage 인자 추가하여 호출
      promptInput = createPrompt(formData, diagnosisType, userLanguage);
      console.log(`--- Gemini Prompt for ${diagnosisType} (${userLanguage}) (start) ---`);
      console.log(promptInput.substring(0, 500) + '...');
      console.log("--- Gemini Prompt End ---");
    } catch (promptError) {
        console.error(`Error creating prompt for ${diagnosisType} (${userLanguage}):`, promptError);
        throw promptError;
    }


    // --- Gemini API 호출 및 응답 처리 ---
    try {
        const safetySettings = [/* ... 안전 설정 ... */];
        const generationConfig = { /* ... 생성 설정 ... */ };

        const result = await model.generateContent(
            promptInput
            // safetySettings,
            // generationConfig
        );
        const response = await result.response;

        // ... (안전 차단 확인 로직 - 이전과 동일) ...
        const promptFeedback = response?.promptFeedback;
        if (promptFeedback?.blockReason) {
             console.error(`Gemini API prompt blocked for ${diagnosisType} (${userLanguage}). Reason: ${promptFeedback.blockReason}`);
             throw new Error(`Analysis request (type: ${diagnosisType}, lang: ${userLanguage}) was blocked by content policy. Reason: ${promptFeedback.blockReason}`);
        }
        if (!response?.candidates?.length || response.candidates[0].finishReason !== 'STOP') {
             const finishReason = response?.candidates?.[0]?.finishReason || 'Unknown';
             console.error(`Gemini API did not finish properly for ${diagnosisType} (${userLanguage}). Finish Reason: ${finishReason}`);
             throw new Error(`AI failed to generate valid analysis for ${diagnosisType} (${userLanguage}). (Finish Reason: ${finishReason})`);
        }


        const text = response.text();
        console.log(`--- Gemini Response for ${diagnosisType} (${userLanguage}) ---`);
        console.log(text);
        console.log("------------------------------------");

        return text; // 번역된 텍스트 반환 기대

    } catch (error) {
        console.error(`Error during Gemini API call for ${diagnosisType} (${userLanguage}):`, error);
        let errorMessage = `AI analysis service failed for ${diagnosisType} (${userLanguage}).`;
        // ... (이전과 동일한 에러 메시지 구체화 로직) ...
         if (error.message.includes('API key not valid')) errorMessage = "Server configuration error: Invalid or missing Gemini API key.";
         else if (error.message.includes('quota') || (error.status && error.status === 429)) errorMessage = "API quota exceeded.";
         else if (error.message.includes('blocked')) errorMessage = error.message;
         else if (error.message.includes('fetch failed')) errorMessage = `Could not connect to the Gemini API server for ${diagnosisType} (${userLanguage}).`;
         else errorMessage = error.message || errorMessage;

        throw new Error(errorMessage);
    }
}

// 5. 함수 내보내기
module.exports = { analyzeSymptoms };