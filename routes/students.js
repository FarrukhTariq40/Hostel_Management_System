const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Room = require('../models/Room');

const router = express.Router();

// All routes require authentication and student role
router.use(protect);
router.use(authorize('student'));

// @route   POST /api/students/room-allocation
// @desc    Submit room allocation request
// @access  Private (Student)
router.post('/room-allocation', async (req, res) => {
  try {
    const { roomType } = req.body;

    if (!roomType || !['2-person', '3-person', '4-person'].includes(roomType)) {
      return res.status(400).json({ message: 'Invalid room type' });
    }

    // Check if user already has a room allocation request
    if (req.user.roomAllocationStatus !== 'none') {
      return res.status(400).json({
        message: `You already have a ${req.user.roomAllocationStatus} room allocation request`,
      });
    }

    // Update user's room allocation status
    req.user.roomType = roomType;
    req.user.roomAllocationStatus = 'pending';
    await req.user.save();

    res.json({
      message: 'Room allocation request submitted successfully',
      roomType,
      status: 'pending',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/students/room-details
// @desc    Get room allocation details
// @access  Private (Student)
router.get('/room-details', async (req, res) => {
  try {
    const user = await req.user.populate('roomNumber');
    res.json({
      roomNumber: req.user.roomNumber,
      roomType: req.user.roomType,
      status: req.user.roomAllocationStatus,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;











