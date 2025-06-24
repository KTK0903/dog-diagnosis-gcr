const express = require('express');
const router = express.Router();
const { analyzeSymptoms } = require('../services/gemini');

router.post('/', async (req, res, next) => {
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

module.exports = router;