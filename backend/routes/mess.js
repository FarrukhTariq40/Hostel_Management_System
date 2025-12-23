const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const MessMenu = require('../models/MessMenu');
const Notification = require('../models/Notification');

const router = express.Router();

// @route   GET /api/mess/menu
// @desc    Get mess menu
// @access  Private
router.get('/menu', protect, async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const menu = await MessMenu.find().sort({ day: 1 });
    res.json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/mess/timings
// @desc    Get mess timings
// @access  Private
router.get('/timings', protect, async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const menu = await MessMenu.findOne().sort({ day: 1 });
    if (!menu) {
      return res.json({
        breakfast: { start: '08:00', end: '10:00' },
        lunch: { start: '12:00', end: '14:00' },
        dinner: { start: '19:00', end: '21:00' },
      });
    }

    res.json({
      breakfast: menu.breakfast.timing,
      lunch: menu.lunch.timing,
      dinner: menu.dinner.timing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/mess/menu
// @desc    Update mess menu (Admin)
// @access  Private (Admin)
router.put('/menu', protect, authorize('admin'), async (req, res) => {
  try {
    const { day, breakfast, lunch, dinner, image } = req.body;

    if (!day || !['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].includes(day)) {
      return res.status(400).json({ message: 'Invalid day' });
    }

    const menu = await MessMenu.findOneAndUpdate(
      { day },
      {
        breakfast: breakfast || { items: [], timing: { start: '08:00', end: '10:00' } },
        lunch: lunch || { items: [], timing: { start: '12:00', end: '14:00' } },
        dinner: dinner || { items: [], timing: { start: '19:00', end: '21:00' } },
        image: image || '',
        updatedBy: req.user._id,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Create notification for students about menu update
    await Notification.create({
      title: 'Mess Menu Updated',
      message: `Mess menu for ${day} has been updated. Please check the latest items in the mess menu section.`,
      recipient: 'student',
      createdBy: req.user._id,
    });

    res.json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/mess/timings
// @desc    Update mess timings (Admin)
// @access  Private (Admin)
router.put(
  '/timings',
  protect,
  authorize('admin'),
  [
    body('breakfast.start').notEmpty().withMessage('Breakfast start time is required'),
    body('breakfast.end').notEmpty().withMessage('Breakfast end time is required'),
    body('lunch.start').notEmpty().withMessage('Lunch start time is required'),
    body('lunch.end').notEmpty().withMessage('Lunch end time is required'),
    body('dinner.start').notEmpty().withMessage('Dinner start time is required'),
    body('dinner.end').notEmpty().withMessage('Dinner end time is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { breakfast, lunch, dinner } = req.body;

      // Update all days with new timings
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const updates = [];

      for (const day of days) {
        const menu = await MessMenu.findOne({ day });
        if (menu) {
          menu.breakfast.timing = breakfast;
          menu.lunch.timing = lunch;
          menu.dinner.timing = dinner;
          menu.updatedBy = req.user._id;
          menu.updatedAt = new Date();
          await menu.save();
          updates.push(menu);
        } else {
          const newMenu = await MessMenu.create({
            day,
            breakfast: { items: [], timing: breakfast },
            lunch: { items: [], timing: lunch },
            dinner: { items: [], timing: dinner },
            updatedBy: req.user._id,
          });
          updates.push(newMenu);
        }
      }

      // Create notification for students about timings update
      await Notification.create({
        title: 'Mess Timings Updated',
        message: 'Mess timings have been updated. Please check the latest timings in the mess section.',
        recipient: 'student',
        createdBy: req.user._id,
      });

      res.json({ message: 'Mess timings updated successfully', updates });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;











