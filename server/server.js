import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
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
import Admin from './models/Admin.js';
import auth from './middleware/auth.js';

dotenv.config();

// Validate critical environment variables at boot
const requiredEnvVars = ['JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(`[FATAL ERROR] Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Connect to Database & Auto-Seed Default Admin
connectDB().then(async () => {
  try {
    const adminCount = await Admin.countDocuments({});
    if (adminCount === 0) {
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      console.log(`Auto-Seed: Database is empty. Seeding default admin user: ${adminEmail}`);
      const defaultAdmin = new Admin({
        email: adminEmail,
        password: adminPassword
      });
      await defaultAdmin.save();
      console.log('Auto-Seed: Admin account created.');
    } else {
      console.log('Auto-Seed: Admin accounts found in database. Skipping seed.');
    }
  } catch (err) {
    console.error('Auto-Seed Error: Failed to check/create default admin:', err);
  }
});

const app = express();

// Apply standard Helmet security headers
app.use(helmet());

// Whitelist-based CORS configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(o => o.length > 0);

// Always allow the production Vercel frontend by default
if (allowedOrigins.length === 0) {
  allowedOrigins.push('https://amanindraclasses-official.vercel.app');
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, postman, curl) or if in whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
    console.error('Error loading dashboard statistics:', error);
    res.status(500).json({ message: 'Error loading dashboard statistics.' });
  }
});

// Root check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Aman Indra Classes API server running successfully.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err.stack || err);
  res.status(500).json({ message: 'An internal server error occurred.' });
});

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
