const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const DailyLog = require('../models/DailyLog');
const auth = require('../middleware/auth');

// Create Goal
router.post('/', auth, async (req, res) => {
  const { title, difficulty, startDate, endDate } = req.body;
  if (!title || !difficulty || !startDate || !endDate) {
    return res.status(400).json({ error: 'Mission parameters missing. Title, difficulty, and duration are required.' });
  }
  const { description, tasks } = req.body;
  const newGoal = new Goal({
    userId: req.user,
    title,
    description,
    startDate,
    endDate,
    difficulty,
    tasks: tasks || []
  });
  const savedGoal = await newGoal.save();
  res.json(savedGoal);
});

// Get all goals for user
router.get('/', auth, async (req, res) => {
  const goals = await Goal.find({ userId: req.user });
  res.json(goals);
});

// Get single goal
router.get('/:id', auth, async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, userId: req.user });
  if (!goal) return res.status(404).json({ error: 'Goal not found' });
  res.json(goal);
});

// Update goal
router.put('/:id', auth, async (req, res) => {
  const { title, difficulty, startDate, endDate } = req.body;
  if (!title || !difficulty || !startDate || !endDate) {
    return res.status(400).json({ error: 'Modification rejected. Essential mission telemetry missing.' });
  }
  const { description, tasks } = req.body;
  const updatedGoal = await Goal.findOneAndUpdate(
    { _id: req.params.id, userId: req.user },
    { title, description, startDate, endDate, difficulty, tasks },
    { new: true }
  );
  if (!updatedGoal) return res.status(404).json({ error: 'Goal not found' });
  res.json(updatedGoal);
});

// Delete goal (Cascade logs)
router.delete('/:id', auth, async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user });
  if (!goal) return res.status(404).json({ error: 'Goal not found' });
  
  // Cascade delete all logs associated with this goal
  await DailyLog.deleteMany({ goalId: req.params.id });
  
  res.json({ message: 'Goal and associated progress data deleted' });
});

module.exports = router;
