import express from 'express';
import Setting from '../models/Setting.js';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';
import { upload, useCloudinary, securityUploadMiddleware } from '../middleware/upload.js';

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
    console.error('Error retrieving settings:', error);
    res.status(500).json({ message: 'Error retrieving settings.' });
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

    console.log(`[Audit Log] Admin updated global settings: ${Object.keys(updates).join(', ')}`);

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
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings.' });
  }
});

// POST /api/settings/upload - Upload settings-related image (Protected)
router.post('/upload', auth, upload.single('image'), securityUploadMiddleware, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }
    const url = useCloudinary ? req.file.path : `/uploads/${req.file.filename}`;
    
    console.log(`[Audit Log] Admin uploaded settings media: ${url}`);

    res.json({ url });
  } catch (error) {
    console.error('Error uploading settings image:', error);
    res.status(500).json({ message: 'Error uploading image.' });
  }
});

export default router;
