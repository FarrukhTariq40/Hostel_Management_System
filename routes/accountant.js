const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Fee = require('../models/Fee');
const User = require('../models/User');
const Notification = require('../models/Notification');
const FinancialReport = require('../models/FinancialReport');

const router = express.Router();

// All routes require accountant role
router.use(protect);
router.use(authorize('accountant'));

// @route   GET /api/accountant/reports
// @desc    Generate financial report
// @access  Private (Accountant)
router.get('/reports', async (req, res) => {
  try {
    const fees = await Fee.find().populate('studentId', 'name email studentId').sort({ createdAt: -1 });

    const totalRevenue = fees.filter((f) => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    const pendingAmount = fees.filter((f) => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);
    const totalFines = fees.reduce((sum, f) => sum + f.fine, 0);
    const pendingFines = fees.filter((f) => f.status !== 'paid').reduce((sum, f) => sum + f.fine, 0);

    const report = {
      totalRevenue,
      pendingAmount,
      totalFines,
      pendingFines,
      totalRecords: fees.length,
      paidRecords: fees.filter((f) => f.status === 'paid').length,
      pendingRecords: fees.filter((f) => f.status === 'pending').length,
      overdueRecords: fees.filter((f) => f.status === 'overdue').length,
      generatedAt: new Date(),
      fees,
    };

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/accountant/reports/send
// @desc    Generate and send financial report to admin (creates notification)
// @access  Private (Accountant)
router.post('/reports/send', async (req, res) => {
  try {
    const fees = await Fee.find().populate('studentId', 'name email studentId').sort({ createdAt: -1 });

    const totalRevenue = fees.filter((f) => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    const pendingAmount = fees.filter((f) => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);
    const totalFines = fees.reduce((sum, f) => sum + f.fine, 0);
    const pendingFines = fees.filter((f) => f.status !== 'paid').reduce((sum, f) => sum + f.fine, 0);

    const report = {
      totalRevenue,
      pendingAmount,
      totalFines,
      pendingFines,
      totalRecords: fees.length,
      paidRecords: fees.filter((f) => f.status === 'paid').length,
      pendingRecords: fees.filter((f) => f.status === 'pending').length,
      overdueRecords: fees.filter((f) => f.status === 'overdue').length,
      generatedAt: new Date(),
    };

    // Persist report for admin to view
    const saved = await FinancialReport.create({
      ...report,
      createdBy: req.user._id,
    });

    res.json({ message: 'Report sent to admin', report: saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/accountant/students
// @desc    Get all students for fee management
// @access  Private (Accountant)
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('name email studentId roomNumber roomType')
      .sort({ name: 1 });

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;











