const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

// GET all companies (sorted by nearest deadline first)
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().sort({ deadline: 1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single company by id
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new company
router.post('/', async (req, res) => {
  try {
    const { name, jobDescription, eligibility, registrationLink, deadline, role, package: pkg } = req.body;

    if (!name || !jobDescription || !eligibility || !deadline) {
      return res.status(400).json({ error: 'name, jobDescription, eligibility, and deadline are required' });
    }

    const company = new Company({
      name,
      jobDescription,
      eligibility,
      registrationLink,
      deadline,
      role,
      package: pkg,
    });

    const saved = await company.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update a company
router.put('/:id', async (req, res) => {
  try {
    const updated = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Company not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a company
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Company.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Company not found' });
    res.json({ message: 'Company deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;