// frontend/src/services/api.js
import axios from 'axios';
import i18n from '../i18n'; // Import the configured i18n instance to access current language

const apiClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API 요청 실패 시 에러 처리를 위한 헬퍼 함수
 * @param {Error} error - Axios 또는 네트워크 에러 객체
 * @param {string} context - 에러가 발생한 작업 문맥 (예: 'skin diagnosis')
 * @returns {Error} - 처리된 에러 객체 (메시지 포함)
 */
const handleError = (error, context = 'API request') => {
  let errorMessage = `Failed during ${context}.`;
  if (error.response) {
    console.error(`Error ${error.response.status} (${error.response.statusText}) in ${context}:`, error.response.data);
    errorMessage = error.response.data?.error || error.response.data?.message || `Server responded with status ${error.response.status}`;
  } else if (error.request) {
    console.error(`No response received for ${context}:`, error.request);
    errorMessage = `Could not connect to the server for ${context}. Please check the backend server and network connection.`;
  } else {
    console.error(`Error setting up request for ${context}:`, error.message);
    errorMessage = `Error in request setup for ${context}: ${error.message}`;
  }
  const customError = new Error(errorMessage);
  return customError;
};


/**
 * 피부 진단 폼 데이터를 백엔드 API로 전송합니다. (현재 언어 정보 포함)
 * @param {object} formData - 피부 진단 폼에서 수집된 데이터.
 * @returns {Promise<object>} - API 응답 데이터를 포함하는 프로미스 (예: { analysis: "..." }).
 * @throws {Error} - API 호출 실패 시 처리된 에러 객체를 throw합니다.
 */
export const diagnoseSkin = async (formData) => {
  const context = 'skin diagnosis';
  try {
    const endpoint = '/api/diagnose/skin';

    console.log(`Sending ${context} data to: ${endpoint}`);

    const dataToSend = {
      ...formData,
      userLanguage: i18n.language
    };
    console.log("Data being sent:", dataToSend);

    const response = await apiClient.post(endpoint, dataToSend);
    console.log(`${context} API Response:`, response.data);
    return response.data;

  } catch (error) {
    throw handleError(error, context);
  }
};

/**
 * 소화기 진단 폼 데이터를 백엔드 API로 전송합니다. (현재 언어 정보 포함)
 * @param {object} formData - 소화기 진단 폼에서 수집된 데이터.
 * @returns {Promise<object>} - API 응답 데이터를 포함하는 프로미스 (예: { analysis: "..." }).
 * @throws {Error} - API 호출 실패 시 처리된 에러 객체를 throw합니다.
 */
export const diagnoseDigestive = async (formData) => {
  const context = 'digestive diagnosis';
  try {
    const endpoint = '/api/diagnose/digestive';

    console.log(`Sending ${context} data to: ${endpoint}`);

    const dataToSend = {
        ...formData,
        userLanguage: i18n.language
    };
    console.log("Data being sent:", dataToSend);

    const response = await apiClient.post(endpoint, dataToSend);
    console.log(`${context} API Response:`, response.data);
    return response.data;

  } catch (error)    {
    throw handleError(error, context);
  }
};

// Add other API functions if needed