import express from 'express';
import Blog from '../models/Blog.js';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';
import { upload, useCloudinary } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Helper function to generate slug from title
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') 
    .replace(/[^\w\-]+/g, '') 
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// GET /api/blogs - Retrieve all blogs (Public)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort('-createdAt');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving blogs.', error: error.message });
  }
});

// GET /api/blogs/:slug - Retrieve single blog by slug (Public)
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug.toLowerCase() });
    if (!blog) {
      return res.status(404).json({ message: 'Blog article not found.' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving blog article.', error: error.message });
  }
});

// POST /api/blogs - Create new Blog post (Protected, handles featured image)
router.post('/', auth, upload.single('featuredImage'), async (req, res) => {
  const { title, excerpt, content, metaTitle, metaDescription, metaKeywords, author } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Missing required fields: title and content.' });
  }

  let featuredImage = '';
  if (req.file) {
    featuredImage = useCloudinary ? req.file.path : `/uploads/${req.file.filename}`;
  }

  let slug = generateSlug(title);
  
  try {
    // Check if slug is unique, append timestamp if duplicate
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const blog = new Blog({
      title,
      slug,
      excerpt: excerpt || '',
      content,
      featuredImage,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt || '',
      metaKeywords: metaKeywords || '',
      author: author || 'Aman Indra Classes',
    });

    await blog.save();

    try {
      const notification = new Notification({
        title: 'New Blog Published',
        message: `Admin published a new article: "${title}".`,
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save blog published notification:', errNotif);
    }

    res.status(201).json({ message: 'Blog post published successfully.', blog });
  } catch (error) {
    res.status(500).json({ message: 'Error publishing blog post.', error: error.message });
  }
});

// PUT /api/blogs/:id - Update Blog post (Protected, handles optional image)
router.put('/:id', auth, upload.single('featuredImage'), async (req, res) => {
  const { title, excerpt, content, metaTitle, metaDescription, metaKeywords, author, slug } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found.' });
    }

    if (title) {
      blog.title = title;
      // Only regenerate slug if it wasn't manually edited or requested to change
      if (!slug) {
        blog.slug = generateSlug(title);
      }
    }
    
    if (slug) {
      blog.slug = generateSlug(slug);
    }
    
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (content) blog.content = content;
    if (metaTitle !== undefined) blog.metaTitle = metaTitle;
    if (metaDescription !== undefined) blog.metaDescription = metaDescription;
    if (metaKeywords !== undefined) blog.metaKeywords = metaKeywords;
    if (author) blog.author = author;

    if (req.file) {
      if (!useCloudinary && blog.featuredImage && blog.featuredImage.startsWith('/uploads/')) {
        const oldPath = path.join('.', blog.featuredImage);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      blog.featuredImage = useCloudinary ? req.file.path : `/uploads/${req.file.filename}`;
    }

    await blog.save();

    try {
      const notification = new Notification({
        title: 'Blog Post Updated',
        message: `Admin updated details for blog article "${blog.title}".`,
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save blog updated notification:', errNotif);
    }

    res.json({ message: 'Blog post updated successfully.', blog });
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog post.', error: error.message });
  }
});

// DELETE /api/blogs/:id - Delete Blog post (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found.' });
    }

    if (!useCloudinary && blog.featuredImage && blog.featuredImage.startsWith('/uploads/')) {
      const filePath = path.join('.', blog.featuredImage);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Blog.findByIdAndDelete(req.params.id);

    try {
      const notification = new Notification({
        title: 'Blog Post Deleted',
        message: `Admin deleted blog article "${blog.title}".`,
        type: 'system'
      });
      await notification.save();
    } catch (errNotif) {
      console.error('Failed to save blog deleted notification:', errNotif);
    }

    res.json({ message: 'Blog post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog post.', error: error.message });
  }
});

export default router;
