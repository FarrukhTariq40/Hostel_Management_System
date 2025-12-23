const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['student', 'accountant', 'admin'],
    required: true,
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true,
  },
  roomNumber: {
    type: String,
    default: null,
  },
  roomType: {
    type: String,
    enum: ['2-person', '3-person', '4-person'],
    default: null,
  },
  roomAllocationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'none'],
    default: 'none',
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  googleId: String,
  facebookId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);























