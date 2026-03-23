const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   POST /api/feedback
// @desc    Submit user feedback
router.post('/', auth, async (req, res) => {
  const { type, message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const feedback = new Feedback({
      userId: req.user,
      type,
      message
    });
    await feedback.save();
    res.status(201).json({ message: 'Feedback received! Thank you for helping us evolve. 🚀' });
  } catch (err) {
    console.error('Feedback Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   GET /api/feedback
// @desc    Get all feedback (Admin only)
router.get('/', [auth, admin], async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    console.error('Fetch Feedback Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback (Admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Intel purged successfully.' });
  } catch (err) {
    console.error('Delete Feedback Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
