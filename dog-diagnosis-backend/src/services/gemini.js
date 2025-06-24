const { GoogleGenerativeAI } = require("@google/generative-ai");

// Secret Manager에서 주입된 API 키를 사용
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeSymptoms(formData, type) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured.');
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const userLanguage = formData.userLanguage || 'en'; // 기본 언어 설정
  // 여기서 formData와 type, userLanguage를 사용하여 Gemini에게 보낼 프롬프트를 만듭니다.
  // 이 부분은 사용자님의 기존 로직에 맞게 채워넣어야 합니다.
  // 아래는 예시 프롬프트입니다.
  const prompt = `You are a helpful veterinary assistant. Based on the following symptoms for a dog's ${type} system, provide a possible analysis. Please respond in ${userLanguage}. Symptoms: ${JSON.stringify(formData)}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error('Failed to get analysis from Gemini API.');
  }
}

module.exports = { analyzeSymptoms };