import express from 'express';
import Gallery from '../models/Gallery.js';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';
import { upload, useCloudinary, cloudinary } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// GET /api/gallery - Fetch all images, with optional category filtering (Public)
router.get('/', async (req, res) => {
  const { category } = req.query;
  const query = {};
  if (category) {
    query.category = category;
  }

  try {
    const images = await Gallery.find(query).sort('-createdAt');
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving gallery images.', error: error.message });
  }
});

// POST /api/gallery - Bulk upload gallery images (Protected, accepts array of 'images')
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ message: 'Missing required field: category.' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Please upload at least one image file.' });
  }

  try {
    const savedImages = [];

    for (const file of req.files) {
      const imageUrl = useCloudinary ? file.path : `/uploads/${file.filename}`;
      const publicId = useCloudinary ? file.filename : ''; // Cloudinary public_id is available on filename in Cloudinary storage setup

      const galleryItem = new Gallery({
        imageUrl,
        category,
        publicId
      });

      await galleryItem.save();
      savedImages.push(galleryItem);
    }

    try {
      const notification = new Notification({
        title: 'Gallery Media Uploaded',
        message: `Admin uploaded ${savedImages.length} images to ${category} category.`,
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save gallery notification:', errNotif);
    }

    res.status(201).json({
      message: `Successfully uploaded ${savedImages.length} images.`,
      images: savedImages
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading gallery images.', error: error.message });
  }
});

// DELETE /api/gallery/:id - Delete single image (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found.' });
    }

    // Deletion clean up
    if (useCloudinary && item.publicId) {
      try {
        // Destroy image on Cloudinary CDN
        await cloudinary.uploader.destroy(item.publicId);
      } catch (err) {
        console.error('Failed to delete image from Cloudinary:', err.message);
      }
    } else if (!useCloudinary && item.imageUrl && item.imageUrl.startsWith('/uploads/')) {
      const filePath = path.join('.', item.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Gallery.findByIdAndDelete(req.params.id);

    try {
      const notification = new Notification({
        title: 'Gallery Media Deleted',
        message: `Admin deleted an image from category ${item.category}.`,
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save gallery deleted notification:', errNotif);
    }

    res.json({ message: 'Gallery image deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting gallery image.', error: error.message });
  }
});

export default router;
