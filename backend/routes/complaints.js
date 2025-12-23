const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/complaints
// @desc    Create a complaint (Student)
// @access  Private (Student)
router.post(
  '/',
  protect,
  authorize('student'),
  [
    body('category').isIn(['mess issue', 'general issue', 'other']).withMessage('Invalid category'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { category, title, description } = req.body;

      const complaint = await Complaint.create({
        studentId: req.user._id,
        studentName: req.user.name,
        category,
        title,
        description,
      });

      res.status(201).json(complaint);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/complaints
// @desc    Get complaints (Student: own, Admin: all)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let complaints;
    if (req.user.role === 'student') {
      complaints = await Complaint.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    } else if (req.user.role === 'admin') {
      complaints = await Complaint.find().sort({ createdAt: -1 }).populate('studentId', 'name email studentId');
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/complaints/:id
// @desc    Get single complaint
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('studentId', 'name email studentId');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check authorization
    if (req.user.role === 'student' && complaint.studentId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/complaints/:id/resolve
// @desc    Resolve complaint (Admin)
// @access  Private (Admin)
router.put(
  '/:id/resolve',
  protect,
  authorize('admin'),
  [body('adminResponse').trim().notEmpty().withMessage('Response is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const complaint = await Complaint.findById(req.params.id);

      if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }

      complaint.status = 'resolved';
      complaint.adminResponse = req.body.adminResponse;
      complaint.resolvedAt = new Date();
      await complaint.save();

      res.json(complaint);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE /api/complaints/:id
// @desc    Delete complaint (Admin)
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    await complaint.deleteOne();

    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;











