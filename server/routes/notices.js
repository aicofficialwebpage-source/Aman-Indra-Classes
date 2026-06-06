import express from 'express';
import Notice from '../models/Notice.js';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/notices - Fetch active notices (Public)
router.get('/', async (req, res) => {
  try {
    const today = new Date();
    // Fetch notices that are active and scheduled for now or in the past
    const notices = await Notice.find({
      isActive: true,
      scheduleDate: { $lte: today }
    }).sort('-scheduleDate -createdAt');
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving active notices.', error: error.message });
  }
});

// GET /api/notices/all - Fetch all notices for Admin (Protected)
router.get('/all', auth, async (req, res) => {
  try {
    const notices = await Notice.find({}).sort('-scheduleDate -createdAt');
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving all notices.', error: error.message });
  }
});

// POST /api/notices - Create dynamic Notice (Protected)
router.post('/', auth, async (req, res) => {
  const { title, content, type, isActive, scheduleDate } = req.body;

  if (!title || !type) {
    return res.status(400).json({ message: 'Missing required fields: title and type.' });
  }

  try {
    const notice = new Notice({
      title,
      content: content || '',
      type,
      isActive: isActive !== undefined ? isActive : true,
      scheduleDate: scheduleDate ? new Date(scheduleDate) : new Date(),
    });

    await notice.save();

    try {
      const notification = new Notification({
        title: 'Announcement Posted',
        message: `Admin posted new notice board bulletin: "${title}".`,
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save notice added notification:', errNotif);
    }

    res.status(201).json({ message: 'Notice board entry created successfully.', notice });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notice.', error: error.message });
  }
});

// PUT /api/notices/:id - Edit Notice Details (Protected)
router.put('/:id', auth, async (req, res) => {
  const { title, content, type, isActive, scheduleDate } = req.body;

  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found.' });
    }

    if (title) notice.title = title;
    if (content !== undefined) notice.content = content;
    if (type) notice.type = type;
    if (isActive !== undefined) notice.isActive = isActive;
    if (scheduleDate !== undefined) notice.scheduleDate = scheduleDate ? new Date(scheduleDate) : new Date();

    await notice.save();

    try {
      const notification = new Notification({
        title: 'Announcement Updated',
        message: `Admin updated notice bulletin: "${notice.title}".`,
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save notice updated notification:', errNotif);
    }

    res.json({ message: 'Notice updated successfully.', notice });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notice.', error: error.message });
  }
});

// DELETE /api/notices/:id - Delete Notice (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found.' });
    }

    await Notice.findByIdAndDelete(req.params.id);

    try {
      const notification = new Notification({
        title: 'Announcement Deleted',
        message: `Admin removed notice board bulletin: "${notice.title}".`,
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save notice deleted notification:', errNotif);
    }

    res.json({ message: 'Notice deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notice.', error: error.message });
  }
});

export default router;
