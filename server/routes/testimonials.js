import express from 'express';
import Testimonial from '../models/Testimonial.js';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';
import { upload, useCloudinary } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// GET /api/testimonials - Fetch published testimonials (Public)
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: 'Published' }).sort('-createdAt');
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving testimonials.', error: error.message });
  }
});

// GET /api/testimonials/all - Fetch all (including Drafts) for Admin (Protected)
router.get('/all', auth, async (req, res) => {
  try {
    const testimonials = await Testimonial.find({}).sort('-createdAt');
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving testimonials.', error: error.message });
  }
});

// POST /api/testimonials - Create Testimonial (Protected, handles optional file upload)
router.post('/', auth, upload.single('photo'), async (req, res) => {
  const { name, review, rating, type, videoUrl, status } = req.body;

  if (!name || !review) {
    return res.status(400).json({ message: 'Missing required fields: name and review text.' });
  }

  let photo = '';
  if (req.file) {
    photo = useCloudinary ? req.file.path : `/uploads/${req.file.filename}`;
  }

  try {
    const testimonial = new Testimonial({
      name,
      review,
      rating: rating ? Number(rating) : 5,
      photo,
      type: type || 'Text',
      videoUrl: videoUrl || '',
      status: status || 'Published',
    });

    await testimonial.save();

    try {
      const notification = new Notification({
        title: 'New Testimonial Added',
        message: `Admin added parent/student appreciation review from ${name}.`,
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save testimonial added notification:', errNotif);
    }

    res.status(201).json({ message: 'Testimonial created successfully.', testimonial });
  } catch (error) {
    res.status(500).json({ message: 'Error creating testimonial.', error: error.message });
  }
});

// PUT /api/testimonials/:id - Update Testimonial (Protected, handles optional file upload)
router.put('/:id', auth, upload.single('photo'), async (req, res) => {
  const { name, review, rating, type, videoUrl, status } = req.body;

  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }

    if (name) testimonial.name = name;
    if (review) testimonial.review = review;
    if (rating !== undefined) testimonial.rating = Number(rating);
    if (type) testimonial.type = type;
    if (videoUrl !== undefined) testimonial.videoUrl = videoUrl;
    if (status) testimonial.status = status;

    if (req.file) {
      if (!useCloudinary && testimonial.photo && testimonial.photo.startsWith('/uploads/')) {
        const oldPath = path.join('.', testimonial.photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      testimonial.photo = useCloudinary ? req.file.path : `/uploads/${req.file.filename}`;
    }

    await testimonial.save();

    try {
      const notification = new Notification({
        title: 'Testimonial Updated',
        message: `Admin edited appreciation review from ${testimonial.name}.`,
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save testimonial updated notification:', errNotif);
    }

    res.json({ message: 'Testimonial updated successfully.', testimonial });
  } catch (error) {
    res.status(500).json({ message: 'Error updating testimonial.', error: error.message });
  }
});

// DELETE /api/testimonials/:id - Delete Testimonial (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }

    if (!useCloudinary && testimonial.photo && testimonial.photo.startsWith('/uploads/')) {
      const filePath = path.join('.', testimonial.photo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Testimonial.findByIdAndDelete(req.params.id);

    try {
      const notification = new Notification({
        title: 'Testimonial Deleted',
        message: `Admin deleted appreciation review from ${testimonial.name}.`,
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save testimonial deleted notification:', errNotif);
    }

    res.json({ message: 'Testimonial deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting testimonial.', error: error.message });
  }
});

export default router;
