import express from 'express';
import Setting from '../models/Setting.js';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// GET /api/settings - Fetch all settings as key-value map
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find({});
    // Convert array of models into flat key-value object
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsMap);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving settings.', error: error.message });
  }
});

// PUT /api/settings - Bulk update or upsert settings (Protected)
router.put('/', auth, async (req, res) => {
  const updates = req.body; // e.g. { heroHeadline: "...", contactPhone: "..." }

  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ message: 'Invalid payload: settings must be a JSON object.' });
  }

  try {
    const operations = Object.entries(updates).map(([key, value]) => {
      return Setting.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
      );
    });

    await Promise.all(operations);

    // Create notification entry in database
    try {
      const notification = new Notification({
        title: 'Settings Synced',
        message: 'Admin updated global website settings & SEO configs.',
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save settings notification:', errNotif);
    }

    // Fetch and return the updated set
    const freshSettings = await Setting.find({});
    const freshSettingsMap = freshSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    res.json({ message: 'Settings updated successfully.', settings: freshSettingsMap });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings.', error: error.message });
  }
});

export default router;
