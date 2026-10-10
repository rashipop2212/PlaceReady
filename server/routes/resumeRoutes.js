const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const Resume = require('../models/Resume');
const Company = require('../models/Company');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

// Technical skills we look for in a job description
const SKILLS = [
  'java', 'python', 'javascript', 'typescript', 'c++', 'c#', 'sql', 'mysql',
  'mongodb', 'postgresql', 'react', 'angular', 'nodejs', 'express', 'spring',
  'hibernate', 'html', 'css', 'git', 'github', 'api', 'aws', 'azure', 'docker',
  'kubernetes', 'linux', 'data structure', 'algorithms', 'oop', 'agile',
  'junit', 'selenium', 'testing', 'django', 'flask', 'bootstrap', 'jwt', 'mern',
];

function normalize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/object[- ]oriented/g, 'oop')
    .replace(/\bapis\b/g, 'api')
    .replace(/data structures/g, 'data structure')
    .replace(/node\.?js/g, 'nodejs');
}

function hasSkill(text, skill) {
  const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9+#])${escaped}($|[^a-z0-9+#])`).test(text);
}

function calculateMatch(resumeText, jdText) {
  const resume = normalize(resumeText);
  const jd = normalize(jdText);

  const required = SKILLS.filter((skill) => hasSkill(jd, skill));

  if (required.length === 0) {
    return { percentage: 0, matched: [], missing: [] };
  }

  const matched = required.filter((skill) => hasSkill(resume, skill));
  const missing = required.filter((skill) => !hasSkill(resume, skill));
  const percentage = Math.round((matched.length / required.length) * 100);

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

// Get match % against ALL companies, ranked best-first
router.get('/match-all', authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.userId });
    if (!resume) {
      return res.status(404).json({ message: 'No resume uploaded yet' });
    }

    const companies = await Company.find();

    const results = companies.map((company) => {
      const result = calculateMatch(resume.extractedText, company.jobDescription);
      console.log(company.name, '| matched:', result.matched, '| missing:', result.missing);
      return {
        companyId: company._id,
        companyName: company.name,
        role: company.role,
        matchPercentage: result.percentage,
      };
    });

    results.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: 'Failed to calculate matches', error: err.message });
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