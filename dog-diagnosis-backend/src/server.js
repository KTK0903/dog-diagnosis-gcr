const express = require('express');
const path = require('path');
const cors = require('cors');
const { analyzeSymptoms } = require('./services/gemini');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const frontendDistPath = path.join(__dirname, '..', '..', 'dog-diagnosis-frontend', 'dist');
app.use(express.static(frontendDistPath));

// API 라우트
app.post('/api/diagnose/:type', async (req, res, next) => {
    const { type } = req.params;
    if (type !== 'skin' && type !== 'digestive') {
        return res.status(404).json({ error: 'Not a valid diagnosis type.' });
    }
    try {
        const formData = req.body;
        if (!formData || typeof formData !== 'object' || Object.keys(formData).length === 0) {
            return res.status(400).json({ error: 'Form data is required.' });
        }
        const analysisResult = await analyzeSymptoms(formData, type);
        res.status(200).json({ analysis: analysisResult });
    } catch (error) {
        next(error);
    }
});

// SPA 라우팅용 catch-all
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
});

// 중앙 에러 처리
app.use((err, req, res, next) => {
    console.error("Server Error:", err.message);
    const statusCode = err.status || 500;
    const message = err.message || 'Internal server error.';
    res.status(statusCode).json({ error: message });
});

app.listen(PORT, () => {
    console.log(`✅ Server listening on port ${PORT}`);
    if (process.env.GEMINI_API_KEY) {
        console.log("🔑 Gemini API Key found.");
    } else {
        console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not set!");
    }
});