const express = require('express');
const router = express.Router();
const DailyLog = require('../models/DailyLog');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create or Update Daily Log
router.post('/', auth, async (req, res) => {
  try {
    const { goalId, date, tasksCompleted, journalEntry, isCompleted } = req.body;
    
    let log = await DailyLog.findOne({ 
      userId: req.user, 
      goalId, 
      date: new Date(date).setHours(0,0,0,0) 
    });

    if (log) {
      log.tasksCompleted = tasksCompleted;
      log.journalEntry = journalEntry;
      log.isCompleted = isCompleted;
      await log.save();
    } else {
      log = new DailyLog({
        userId: req.user,
        goalId,
        date: new Date(date).setHours(0,0,0,0),
        tasksCompleted,
        journalEntry,
        isCompleted
      });
      await log.save();

      // Award XP if completed
      if (isCompleted) {
        const user = await User.findById(req.user);
        user.experience += 50;
        if (user.experience >= user.level * 200) {
          user.level += 1;
        }
        await user.save();
      }
    }

    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get logs for a goal
router.get('/:goalId', auth, async (req, res) => {
  try {
    const logs = await DailyLog.find({ userId: req.user, goalId: req.params.goalId }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all logs for user (for heatmap)
router.get('/', auth, async (req, res) => {
  try {
    const logs = await DailyLog.find({ userId: req.user }).select('date isCompleted goalId tasksCompleted');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get weekly review summary
router.get('/review/weekly', auth, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const logs = await DailyLog.find({ 
      userId: req.user, 
      date: { $gte: sevenDaysAgo } 
    });

    const summary = {
      totalCompleted: logs.filter(l => l.isCompleted).length,
      missedDays: 7 - logs.length,
      notes: logs.map(l => l.journalEntry.learned).filter(Boolean)
    };
    
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
