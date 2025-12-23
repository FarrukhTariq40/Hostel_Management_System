const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  roomCharge: {
    type: Number,
    required: true,
  },
  messCharge: {
    type: Number,
    default: 0,
  },
  fine: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'overdue'],
    default: 'pending',
  },
  dueDate: {
    type: Date,
    required: true,
  },
  paidDate: {
    type: Date,
    default: null,
  },
  paymentMethod: {
    type: String,
    default: '',
  },
  remarks: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Fee', feeSchema);











