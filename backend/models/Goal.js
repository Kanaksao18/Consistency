const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  tasks: [{ 
    title: { type: String, required: true },
    isDefault: { type: Boolean, default: true }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
