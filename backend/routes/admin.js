const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Room = require('../models/Room');
const FinancialReport = require('../models/FinancialReport');

const router = express.Router();

// All routes require admin role
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/room-requests
// @desc    Get all pending room allocation requests
// @access  Private (Admin)
router.get('/room-requests', async (req, res) => {
  try {
    const requests = await User.find({
      role: 'student',
      roomAllocationStatus: 'pending',
    }).select('name email studentId roomType roomAllocationStatus createdAt');

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/room-requests/:id/approve
// @desc    Approve room allocation request
// @access  Private (Admin)
router.put('/room-requests/:id/approve', async (req, res) => {
  try {
    const { roomNumber } = req.body;
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.roomAllocationStatus !== 'pending') {
      return res.status(400).json({ message: 'No pending request found' });
    }

    // Find available room
    let room;
    if (roomNumber) {
      room = await Room.findOne({ roomNumber, roomType: student.roomType });
      if (!room) {
        return res.status(404).json({ message: 'Room not found or type mismatch' });
      }
    } else {
      room = await Room.findOne({
        roomType: student.roomType,
        $expr: { $lt: ['$currentOccupancy', '$capacity'] },
        isAvailable: true,
      });
    }

    if (!room) {
      return res.status(400).json({ message: 'No available room found' });
    }

    if (room.currentOccupancy >= room.capacity) {
      return res.status(400).json({ message: 'Room is full' });
    }

    // Allocate room
    student.roomNumber = room.roomNumber;
    student.roomAllocationStatus = 'approved';
    await student.save();

    room.students.push(student._id);
    room.currentOccupancy = room.students.length;
    if (room.currentOccupancy >= room.capacity) {
      room.isAvailable = false;
    }
    await room.save();

    res.json({
      message: 'Room allocation approved',
      student: {
        name: student.name,
        roomNumber: student.roomNumber,
        roomType: student.roomType,
      },
      room,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/room-requests/:id/reject
// @desc    Reject room allocation request
// @access  Private (Admin)
router.put('/room-requests/:id/reject', async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.roomAllocationStatus !== 'pending') {
      return res.status(400).json({ message: 'No pending request found' });
    }

    student.roomAllocationStatus = 'rejected';
    student.roomType = null;
    await student.save();

    res.json({
      message: 'Room allocation request rejected',
      student: {
        name: student.name,
        status: student.roomAllocationStatus,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/students
// @desc    Get all students
// @access  Private (Admin)
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ name: 1 });

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/reports
// @desc    Get financial reports sent by accountant
// @access  Private (Admin)
router.get('/reports', async (req, res) => {
  try {
    const reports = await FinancialReport.find()
      .populate('createdBy', 'name email role')
      .sort({ generatedAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

