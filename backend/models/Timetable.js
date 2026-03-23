const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timeSlot: { type: String, required: true }, // e.g., "07:00 - 08:00"
  dayOfWeek: { type: String, required: true }, // e.g., "Monday"
  taskName: { type: String, required: true },
  linkedGoalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
