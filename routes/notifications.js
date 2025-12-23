const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const Notification = require('../models/Notification');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/notifications
// @desc    Create notification (Admin)
// @access  Private (Admin)
router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, message, recipient } = req.body;

      const notification = await Notification.create({
        title,
        message,
        recipient: recipient || 'all',
        createdBy: req.user._id,
      });

      res.status(201).json(notification);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/notifications
// @desc    Get notifications and mark them as read for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let notifications;
    if (req.user.role === 'admin') {
      notifications = await Notification.find().sort({ createdAt: -1 }).populate('createdBy', 'name');
    } else {
      notifications = await Notification.find({
        $or: [{ recipient: 'all' }, { recipient: req.user.role }],
      })
        .sort({ createdAt: -1 })
        .populate('createdBy', 'name');
    }

    // Mark as read for current user
    for (const notif of notifications) {
      const alreadyRead = notif.readBy.some(
        (read) => read.userId.toString() === req.user._id.toString()
      );
      if (!alreadyRead) {
        notif.readBy.push({ userId: req.user._id });
        await notif.save();
      }
    }

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Get count of unread notifications for current user (without marking them as read)
// @access  Private
router.get('/unread-count', protect, async (req, res) => {
  try {
    let query;
    if (req.user.role === 'admin') {
      // Admin can see all notifications
      query = {};
    } else {
      // Students / other roles see only notifications for them or for all
      query = {
        $or: [{ recipient: 'all' }, { recipient: req.user.role }],
      };
    }

    const notifications = await Notification.find(query);

    const unreadCount = notifications.filter((notif) => {
      return !notif.readBy.some(
        (read) => read.userId.toString() === req.user._id.toString()
      );
    }).length;

    res.json({ count: unreadCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/notifications/:id
// @desc    Get single notification
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate('createdBy', 'name');

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Mark as read
    const alreadyRead = notification.readBy.some(
      (read) => read.userId.toString() === req.user._id.toString()
    );
    if (!alreadyRead) {
      notification.readBy.push({ userId: req.user._id });
      await notification.save();
    }

    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification (Admin)
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.deleteOne();

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;











