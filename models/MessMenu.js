const mongoose = require('mongoose');

const messMenuSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
    unique: true,
  },
  breakfast: {
    items: [String],
    timing: {
      start: String,
      end: String,
    },
  },
  lunch: {
    items: [String],
    timing: {
      start: String,
      end: String,
    },
  },
  dinner: {
    items: [String],
    timing: {
      start: String,
      end: String,
    },
  },
  image: {
    type: String,
    default: '',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MessMenu', messMenuSchema);











