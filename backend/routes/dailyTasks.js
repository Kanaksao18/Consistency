const express = require('express');
const router = express.Router();
const DailyTask = require('../models/DailyTask');
const auth = require('../middleware/auth');

// Get today's tasks + analytics data
router.get('/', auth, async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  console.log(`[DailyTasks] Fetching for user: ${req.user}`);
  console.log(`[DailyTasks] Date Range: ${startOfDay.toISOString()} - ${endOfDay.toISOString()}`);

  // Get today's quests
  const tasks = await DailyTask.find({
    userId: req.user,
    date: { $gte: startOfDay, $lte: endOfDay }
  }).sort({ date: -1 });

  console.log(`[DailyTasks] Found ${tasks.length} tasks`);

  // Get all tasks for analytics (Weekly Average / Peak)
  const allTasks = await DailyTask.find({ userId: req.user, completed: true });

  res.json({ tasks, allTasks });
});

// Create new quest
router.post('/', auth, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Task text is required' });

  const task = new DailyTask({
    userId: req.user,
    text
  });
  await task.save();
  console.log(`[DailyTasks] Created task: ${task.text} for user ${req.user} at ${task.date.toISOString()}`);
  res.status(201).json(task);
});

// Toggle completion
router.patch('/:id', auth, async (req, res) => {
  const task = await DailyTask.findOne({ _id: req.params.id, userId: req.user });
  if (!task) return res.status(404).json({ error: 'Quest not found' });

  task.completed = !task.completed;
  if (task.completed) {
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user, { $inc: { experience: 10 } });
  }
  await task.save();
  res.json(task);
});

// Delete quest
router.delete('/:id', auth, async (req, res) => {
  await DailyTask.findOneAndDelete({ _id: req.params.id, userId: req.user });
  res.json({ message: 'Quest abandoned' });
});

module.exports = router;
