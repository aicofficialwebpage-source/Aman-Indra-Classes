import express from 'express';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications - Retrieve all notifications (Protected, sorted newest first)
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort('-createdAt');
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving notifications.', error: error.message });
  }
});

// PUT /api/notifications/read-all - Mark all notifications as read (Protected)
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications.', error: error.message });
  }
});

// PUT /api/notifications/:id - Mark single notification as read (Protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    notification.read = true;
    await notification.save();
    res.json({ message: 'Notification marked as read.', notification });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification.', error: error.message });
  }
});

// DELETE /api/notifications/:id - Delete a notification (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    res.json({ message: 'Notification deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification.', error: error.message });
  }
});

export default router;
