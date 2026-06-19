import express from 'express';
import Achiever from '../models/Achiever.js';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';
import { upload, useCloudinary, securityUploadMiddleware } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// GET /api/achievers - Retrieve all achievers (Public)
router.get('/', async (req, res) => {
  try {
    const achievers = await Achiever.find({}).sort('-createdAt');
    res.json(achievers);
  } catch (error) {
    console.error('Error retrieving achievers:', error);
    res.status(500).json({ message: 'Error retrieving achievers.' });
  }
});

// POST /api/achievers - Create new Achiever (Protected, handles file upload)
router.post('/', auth, upload.single('photo'), securityUploadMiddleware, async (req, res) => {
  const { name, school, marks, rank, achievement, category, year } = req.body;

  if (!name || !achievement || !category) {
    return res.status(400).json({ message: 'Missing required fields: name, achievement, and category.' });
  }

  let photo = '';
  if (req.file) {
    photo = useCloudinary ? req.file.path : `/uploads/${req.file.filename}`;
  }

  try {
    const achiever = new Achiever({
      name,
      photo,
      school: school || '',
      marks: marks || '',
      rank: rank || '',
      achievement,
      category,
      year: year || new Date().getFullYear().toString(),
    });

    await achiever.save();

    console.log(`[Audit Log] Admin achiever profile created for: ${name}`);

    try {
      const notification = new Notification({
        title: 'New Topper Added',
        message: `Admin added achiever profile for ${name}.`,
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save topper added notification:', errNotif);
    }

    res.status(201).json({ message: 'Achiever added successfully.', achiever });
  } catch (error) {
    console.error('Error creating achiever profile:', error);
    res.status(500).json({ message: 'Error creating achiever profile.' });
  }
});

// PUT /api/achievers/:id - Edit Achiever details (Protected, handles optional file upload)
router.put('/:id', auth, upload.single('photo'), securityUploadMiddleware, async (req, res) => {
  const { name, school, marks, rank, achievement, category, year } = req.body;

  try {
    const achiever = await Achiever.findById(req.params.id);
    if (!achiever) {
      return res.status(404).json({ message: 'Achiever profile not found.' });
    }

    // Update text fields
    if (name) achiever.name = name;
    if (school !== undefined) achiever.school = school;
    if (marks !== undefined) achiever.marks = marks;
    if (rank !== undefined) achiever.rank = rank;
    if (achievement) achiever.achievement = achievement;
    if (category) achiever.category = category;
    if (year) achiever.year = year;

    // Handle new photo upload
    if (req.file) {
      // Optional: Delete old local file if replacing and not using Cloudinary
      if (!useCloudinary && achiever.photo && achiever.photo.startsWith('/uploads/')) {
        const oldPath = path.join('.', achiever.photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      
      achiever.photo = useCloudinary ? req.file.path : `/uploads/${req.file.filename}`;
    }

    await achiever.save();

    console.log(`[Audit Log] Admin achiever profile updated for: ${achiever.name}`);

    try {
      const notification = new Notification({
        title: 'Topper Profile Updated',
        message: `Admin modified details for topper ${achiever.name}.`,
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save topper updated notification:', errNotif);
    }

    res.json({ message: 'Achiever updated successfully.', achiever });
  } catch (error) {
    console.error('Error updating achiever:', error);
    res.status(500).json({ message: 'Error updating achiever.' });
  }
});

// DELETE /api/achievers/:id - Remove Achiever profile (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const achiever = await Achiever.findById(req.params.id);
    if (!achiever) {
      return res.status(404).json({ message: 'Achiever profile not found.' });
    }

    // Clean up local photo if exists
    if (!useCloudinary && achiever.photo && achiever.photo.startsWith('/uploads/')) {
      const filePath = path.join('.', achiever.photo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Achiever.findByIdAndDelete(req.params.id);

    console.log(`[Audit Log] Admin achiever profile deleted: ${achiever.name}`);

    try {
      const notification = new Notification({
        title: 'Topper Profile Deleted',
        message: `Admin deleted achiever profile for ${achiever.name}.`,
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save topper deleted notification:', errNotif);
    }

    res.json({ message: 'Achiever profile deleted successfully.' });
  } catch (error) {
    console.error('Error deleting achiever:', error);
    res.status(500).json({ message: 'Error deleting achiever.' });
  }
});

export default router;
