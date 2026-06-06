import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/auth.js';
import leadRoutes from './routes/leads.js';
import achieverRoutes from './routes/achievers.js';
import facultyRoutes from './routes/faculty.js';
import testimonialRoutes from './routes/testimonials.js';
import galleryRoutes from './routes/gallery.js';
import blogRoutes from './routes/blogs.js';
import noticeRoutes from './routes/notices.js';
import settingRoutes from './routes/settings.js';
import notificationRoutes from './routes/notifications.js';

// Model imports (for dashboard stats)
import Lead from './models/Lead.js';
import Achiever from './models/Achiever.js';
import Faculty from './models/Faculty.js';
import Testimonial from './models/Testimonial.js';
import Blog from './models/Blog.js';
import Gallery from './models/Gallery.js';
import auth from './middleware/auth.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins for dev/sandbox ease
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static uploads locally
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/achievers', achieverRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/notifications', notificationRoutes);

// GET /api/dashboard/stats - Admin Dashboard aggregator (Protected)
app.get('/api/dashboard/stats', auth, async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments({});
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const totalAchievers = await Achiever.countDocuments({});
    const totalFaculty = await Faculty.countDocuments({});
    const totalTestimonials = await Testimonial.countDocuments({});
    const totalBlogs = await Blog.countDocuments({});
    const totalGallery = await Gallery.countDocuments({});

    res.json({
      totalLeads,
      newLeads,
      totalAchievers,
      totalFaculty,
      totalTestimonials,
      totalBlogs,
      totalGallery,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error loading dashboard statistics.', error: error.message });
  }
});

// Root check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Aman Indra Classes API server running successfully.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An internal server error occurred.', error: err.message });
});

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
