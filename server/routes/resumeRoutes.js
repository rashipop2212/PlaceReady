const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const Resume = require('../models/Resume');
const Company = require('../models/Company');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

// Common words to ignore when matching (not meaningful skills)
const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'you', 'your', 'are', 'will', 'have', 'has',
  'this', 'that', 'from', 'our', 'their', 'they', 'able', 'must', 'should',
  'can', 'not', 'all', 'any', 'who', 'what', 'when', 'where', 'how', 'why',
  'job', 'role', 'work', 'team', 'company', 'about', 'looking', 'strong',
]);

function extractKeywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

function calculateMatch(resumeText, jdText) {
  const resumeWords = new Set(extractKeywords(resumeText));
  const jdWords = [...new Set(extractKeywords(jdText))];

  if (jdWords.length === 0) return { percentage: 0, matched: [], missing: [] };

  const matched = jdWords.filter((word) => resumeWords.has(word));
  const missing = jdWords.filter((word) => !resumeWords.has(word));

  const percentage = Math.round((matched.length / jdWords.length) * 100);

  return { percentage, matched, missing };
}

// Upload resume (PDF) — extracts text and saves/updates it for the logged-in user
router.post('/upload', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

       const parser = new PDFParse({ data: req.file.buffer });
    const result = await parser.getText();
    await parser.destroy();
    const extractedText = result.text;

    const resume = await Resume.findOneAndUpdate(
      { user: req.userId },
      { fileName: req.file.originalname, extractedText },
      { new: true, upsert: true }
    );

    res.json({ message: 'Resume uploaded successfully', fileName: resume.fileName });
  } catch (err) {
    console.error('Resume upload error:', err);
    res.status(500).json({ message: 'Failed to process resume', error: err.message });
 
  }
});

// Get match % between the logged-in user's resume and a specific company's JD
router.get('/match/:companyId', authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.userId });
    if (!resume) {
      return res.status(404).json({ message: 'No resume uploaded yet' });
    }

    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const result = calculateMatch(resume.extractedText, company.jobDescription);

    res.json({
      company: company.name,
      matchPercentage: result.percentage,
      matchedKeywords: result.matched,
      missingKeywords: result.missing,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to calculate match', error: err.message });
  }
});

// Check if the logged-in user has a resume uploaded
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.userId });
    res.json({ uploaded: !!resume, fileName: resume?.fileName || null });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;