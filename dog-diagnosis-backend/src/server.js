const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// 기본 미들웨어
app.use(cors()); // CORS는 간단하게 유지
app.use(express.json());

// 프론트엔드 정적 파일 제공
const frontendDistPath = path.join(__dirname, '..', 'dog-diagnosis-frontend', 'dist');
app.use(express.static(frontendDistPath));

// API 라우트 마운트
try {
    const diagnoseSkinRoutes = require('./routes/diagnoseSkin');
    const diagnoseDigestiveRoutes = require('./routes/diagnoseDigestive');
    app.use('/api/diagnose/skin', diagnoseSkinRoutes);
    app.use('/api/diagnose/digestive', diagnoseDigestiveRoutes);
} catch (error) {
    console.error("CRITICAL: Failed to load API routes.", error);
    process.exit(1);
}

// 모든 API 외 요청을 프론트엔드의 index.html로 연결 (SPA 라우팅용)
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