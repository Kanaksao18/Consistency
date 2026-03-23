const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const auth = require('../middleware/auth');

// Add or Update Timetable Slot
router.post('/', auth, async (req, res) => {
  const { timeSlot, taskName, dayOfWeek } = req.body;
  
  if (!timeSlot || !taskName || !dayOfWeek) {
    return res.status(400).json({ error: 'Incomplete matrix telemetry. Time, Task, and Day are mandatory.' });
  }

  // Check if slot already exists for that day
  let slot = await Timetable.findOne({ userId: req.user, timeSlot, dayOfWeek });

  if (slot) {
    slot.taskName = taskName;
    slot.linkedGoalId = req.body.linkedGoalId;
    await slot.save();
  } else {
    slot = new Timetable({
      userId: req.user,
      timeSlot,
      taskName,
      linkedGoalId: req.body.linkedGoalId,
      dayOfWeek
    });
    await slot.save();
  }
  res.json(slot);
});

// Get user timetable
router.get('/', auth, async (req, res) => {
  const timetable = await Timetable.find({ userId: req.user }).sort({ dayOfWeek: 1, timeSlot: 1 });
  res.json(timetable);
});

// Delete slot
router.delete('/:id', auth, async (req, res) => {
  const slot = await Timetable.findOneAndDelete({ _id: req.params.id, userId: req.user });
  if (!slot) return res.status(404).json({ error: 'Data segment not found in matrix.' });
  res.json({ message: 'Slot purged from success matrix' });
});

module.exports = router;
