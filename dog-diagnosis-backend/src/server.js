const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const { analyzeSymptoms } = require('./services/gemini'); // gemini 서비스 직접 가져오기

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const frontendDistPath = path.join(__dirname, '..', '..', 'dog-diagnosis-frontend', 'dist');
app.use(express.static(frontendDistPath));

// --- API 라우트를 server.js에 직접 정의 ---

// 피부 진단 API
app.post('/api/diagnose/skin', async (req, res, next) => {
    try {
        const formData = req.body;
        if (!formData || typeof formData !== 'object' || Object.keys(formData).length === 0) {
            return res.status(400).json({ error: 'Form data is required.' });
        }
        const analysisResult = await analyzeSymptoms(formData, 'skin');
        res.status(200).json({ analysis: analysisResult });
    } catch (error) {
        next(error);
    }
});

// 소화기 진단 API
app.post('/api/diagnose/digestive', async (req, res, next) => {
    try {
        const formData = req.body;
        if (!formData || typeof formData !== 'object' || Object.keys(formData).length === 0) {
            return res.status(400).json({ error: 'Form data is required.' });
        }
        const analysisResult = await analyzeSymptoms(formData, 'digestive');
        res.status(200).json({ analysis: analysisResult });
    } catch (error) {
        next(error);
    }
});

// -----------------------------------------

// API 외 모든 GET 요청을 프론트엔드의 index.html로 연결
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// 중앙 에러 처리 미들웨어
app.use((err, req, res, next) => {
    console.error("--- Server Error Captured ---", err.message);
    const statusCode = err.status || 500;
    const message = err.message || 'An internal server error occurred.';
    res.status(statusCode).json({ error: message });
});

// 서버 리스닝 시작
app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
    if (process.env.GEMINI_API_KEY) {
        console.log("🔑 Gemini API Key found.");
    } else {
        console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not set!");
    }
});