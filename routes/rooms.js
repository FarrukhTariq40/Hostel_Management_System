const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Room = require('../models/Room');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/rooms
// @desc    Get all rooms with charges
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const rooms = await Room.find().populate('students', 'name email studentId').sort({ roomNumber: 1 });

    // Get room charges summary
    const charges = {
      '2-person': 0,
      '3-person': 0,
      '4-person': 0,
    };

    rooms.forEach((room) => {
      if (charges[room.roomType] === 0) {
        charges[room.roomType] = room.charge;
      }
    });

    res.json({ rooms, charges });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/rooms/charges
// @desc    Get room charges for each type
// @access  Private
router.get('/charges', protect, async (req, res) => {
  try {
    const rooms = await Room.find();
    const charges = {
      '2-person': 0,
      '3-person': 0,
      '4-person': 0,
    };

    rooms.forEach((room) => {
      if (charges[room.roomType] === 0) {
        charges[room.roomType] = room.charge;
      }
    });

    res.json(charges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/rooms/charges
// @desc    Update room charges (Admin)
// @access  Private (Admin)
router.put('/charges', protect, authorize('admin'), async (req, res) => {
  try {
    const { '2-person': twoPerson, '3-person': threePerson, '4-person': fourPerson } = req.body;

    const updates = [];
    if (twoPerson !== undefined) {
      await Room.updateMany({ roomType: '2-person' }, { charge: twoPerson });
      updates.push({ type: '2-person', charge: twoPerson });
    }
    if (threePerson !== undefined) {
      await Room.updateMany({ roomType: '3-person' }, { charge: threePerson });
      updates.push({ type: '3-person', charge: threePerson });
    }
    if (fourPerson !== undefined) {
      await Room.updateMany({ roomType: '4-person' }, { charge: fourPerson });
      updates.push({ type: '4-person', charge: fourPerson });
    }

    res.json({ message: 'Room charges updated successfully', updates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/rooms/allocations
// @desc    Get all room allocations (Admin)
// @access  Private (Admin)
router.get('/allocations', protect, authorize('admin'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('name email studentId roomNumber roomType roomAllocationStatus')
      .sort({ name: 1 });

    const rooms = await Room.find().populate('students', 'name email studentId').sort({ roomNumber: 1 });

    res.json({ students, rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/rooms
// @desc    Create a room (Admin)
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { roomNumber, roomType, charge } = req.body;

    const capacityMap = {
      '2-person': 2,
      '3-person': 3,
      '4-person': 4,
    };

    const room = await Room.create({
      roomNumber,
      roomType,
      capacity: capacityMap[roomType],
      charge,
    });

    res.status(201).json(room);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Room number already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;











