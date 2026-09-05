const express = require('express');
const router = express.Router();
const RoadmapProgress = require('../models/RoadmapProgress');
const authMiddleware = require('../middleware/authMiddleware');

// Get the logged-in user's completed task IDs
router.get('/progress', authMiddleware, async (req, res) => {
  try {
    const progress = await RoadmapProgress.findOne({ user: req.userId });
    res.json({ completedTasks: progress?.completedTasks || [] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle a task's completed state
router.post('/toggle', authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.body;
    if (!taskId) return res.status(400).json({ message: 'taskId is required' });

    let progress = await RoadmapProgress.findOne({ user: req.userId });

    if (!progress) {
      progress = await RoadmapProgress.create({ user: req.userId, completedTasks: [taskId] });
      return res.json({ completedTasks: progress.completedTasks });
    }

    if (progress.completedTasks.includes(taskId)) {
      progress.completedTasks = progress.completedTasks.filter((id) => id !== taskId);
    } else {
      progress.completedTasks.push(taskId);
    }

    await progress.save();
    res.json({ completedTasks: progress.completedTasks });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;