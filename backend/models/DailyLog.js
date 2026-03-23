const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  tasksCompleted: [{ title: String, completed: Boolean }],
  journalEntry: {
    did: { type: String },
    learned: { type: String },
    challenges: { type: String }
  },
  isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

// Index for quick lookup by date and user
dailyLogSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
