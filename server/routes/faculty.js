import express from 'express';
import Faculty from '../models/Faculty.js';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';
import { upload, useCloudinary, securityUploadMiddleware } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// GET /api/faculty - Retrieve all faculty members (Public)
router.get('/', async (req, res) => {
  try {
    const faculty = await Faculty.find({}).sort('orderIndex createdAt');
    res.json(faculty);
  } catch (error) {
    console.error('Error retrieving faculty profiles:', error);
    res.status(500).json({ message: 'Error retrieving faculty profiles.' });
  }
});

// POST /api/faculty - Create new Faculty Profile (Protected, handles file upload)
router.post('/', auth, upload.single('photo'), securityUploadMiddleware, async (req, res) => {
  const { name, subject, qualification, experience, bio, orderIndex } = req.body;

  if (!name || !subject || !qualification || !experience) {
    return res.status(400).json({ message: 'Missing required fields: name, subject, qualification, and experience.' });
  }

  let photo = '';
  if (req.file) {
    photo = useCloudinary ? req.file.path : `/uploads/${req.file.filename}`;
  }

  try {
    const faculty = new Faculty({
      name,
      photo,
      subject,
      qualification,
      experience,
      bio: bio || '',
      orderIndex: orderIndex !== undefined ? Number(orderIndex) : 0,
    });

    await faculty.save();

    console.log(`[Audit Log] Admin faculty profile created for: ${name}`);

    try {
      const notification = new Notification({
        title: 'New Teacher Added',
        message: `Admin added faculty profile for ${name} (${subject}).`,
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save faculty added notification:', errNotif);
    }

    res.status(201).json({ message: 'Faculty profile created successfully.', faculty });
  } catch (error) {
    console.error('Error creating faculty profile:', error);
    res.status(500).json({ message: 'Error creating faculty profile.' });
  }
});

// PUT /api/faculty/:id - Update Faculty details (Protected, handles optional upload)
router.put('/:id', auth, upload.single('photo'), securityUploadMiddleware, async (req, res) => {
  const { name, subject, qualification, experience, bio, orderIndex } = req.body;

  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty profile not found.' });
    }

    if (name) faculty.name = name;
    if (subject) faculty.subject = subject;
    if (qualification) faculty.qualification = qualification;
    if (experience) faculty.experience = experience;
    if (bio !== undefined) faculty.bio = bio;
    if (orderIndex !== undefined) faculty.orderIndex = Number(orderIndex);

    if (req.file) {
      if (!useCloudinary && faculty.photo && faculty.photo.startsWith('/uploads/')) {
        const oldPath = path.join('.', faculty.photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      faculty.photo = useCloudinary ? req.file.path : `/uploads/${req.file.filename}`;
    }

    await faculty.save();

    console.log(`[Audit Log] Admin faculty profile updated for: ${faculty.name}`);

    try {
      const notification = new Notification({
        title: 'Teacher Profile Updated',
        message: `Admin updated details for teacher ${faculty.name}.`,
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save faculty updated notification:', errNotif);
    }

    res.json({ message: 'Faculty profile updated successfully.', faculty });
  } catch (error) {
    console.error('Error updating faculty profile:', error);
    res.status(500).json({ message: 'Error updating faculty profile.' });
  }
});

// DELETE /api/faculty/:id - Remove Faculty profile (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty profile not found.' });
    }

    if (!useCloudinary && faculty.photo && faculty.photo.startsWith('/uploads/')) {
      const filePath = path.join('.', faculty.photo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Faculty.findByIdAndDelete(req.params.id);

    console.log(`[Audit Log] Admin faculty profile deleted: ${faculty.name}`);

    try {
      const notification = new Notification({
        title: 'Teacher Profile Deleted',
        message: `Admin deleted faculty profile for ${faculty.name}.`,
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save faculty deleted notification:', errNotif);
    }

    res.json({ message: 'Faculty profile deleted successfully.' });
  } catch (error) {
    console.error('Error deleting faculty profile:', error);
    res.status(500).json({ message: 'Error deleting faculty profile.' });
  }
});

export default router;
