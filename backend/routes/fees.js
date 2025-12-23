const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Fee = require('../models/Fee');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/fees
// @desc    Get fees (Student: own, Accountant/Admin: all)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let fees;
    if (req.user.role === 'student') {
      fees = await Fee.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    } else if (req.user.role === 'accountant' || req.user.role === 'admin') {
      fees = await Fee.find().sort({ createdAt: -1 }).populate('studentId', 'name email studentId');
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(fees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/fees/status
// @desc    Get fee status summary (Student)
// @access  Private (Student)
router.get('/status', protect, authorize('student'), async (req, res) => {
  try {
    const fees = await Fee.find({ studentId: req.user._id });

    const paid = fees.filter((f) => f.status === 'paid').length;
    const pending = fees.filter((f) => f.status === 'pending').length;
    const overdue = fees.filter((f) => f.status === 'overdue').length;
    const totalFine = fees.reduce((sum, f) => sum + f.fine, 0);

    res.json({
      paid,
      pending,
      overdue,
      totalFine,
      fees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/fees/pending-fines
// @desc    Get pending fines (Accountant)
// @access  Private (Accountant)
router.get('/pending-fines', protect, authorize('accountant'), async (req, res) => {
  try {
    const fees = await Fee.find({ fine: { $gt: 0 }, status: { $ne: 'paid' } })
      .populate('studentId', 'name email studentId')
      .sort({ createdAt: -1 });

    const totalPendingFine = fees.reduce((sum, f) => sum + f.fine, 0);

    res.json({
      fees,
      totalPendingFine,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/fees
// @desc    Create fee record (Accountant/Admin)
// @access  Private (Accountant/Admin)
router.post(
  '/',
  protect,
  authorize('accountant', 'admin'),
  async (req, res) => {
    try {
      const { studentId, amount, roomCharge, messCharge, fine, dueDate } = req.body;

      const student = await User.findById(studentId);
      if (!student || student.role !== 'student') {
        return res.status(400).json({ message: 'Invalid student ID' });
      }

      const fee = await Fee.create({
        studentId,
        studentName: student.name,
        studentEmail: student.email,
        amount,
        roomCharge,
        messCharge: messCharge || 0,
        fine: fine || 0,
        dueDate,
      });

      res.status(201).json(fee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/fees/:id/pay
// @desc    Update fee payment status (Accountant)
// @access  Private (Accountant)
router.put('/:id/pay', protect, authorize('accountant', 'admin'), async (req, res) => {
  try {
    const { paymentMethod, remarks } = req.body;

    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }

    fee.status = 'paid';
    fee.paidDate = new Date();
    fee.paymentMethod = paymentMethod || '';
    fee.remarks = remarks || '';
    await fee.save();

    res.json(fee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/fees/:id/add-fine
// @desc    Add fine to existing fee record (Accountant)
// @access  Private (Accountant)
router.put('/:id/add-fine', protect, authorize('accountant', 'admin'), async (req, res) => {
  try {
    const { fine, amount, reason } = req.body;

    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }

    if (fee.status === 'paid') {
      return res.status(400).json({ message: 'Cannot add fine to a paid fee record' });
    }

    fee.fine = fine || fee.fine;
    fee.amount = amount || fee.amount;
    
    // Append reason to remarks
    if (reason) {
      fee.remarks = fee.remarks 
        ? `${fee.remarks} | Fine added: ${reason}` 
        : `Fine added: ${reason}`;
    }

    await fee.save();

    res.json(fee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;











