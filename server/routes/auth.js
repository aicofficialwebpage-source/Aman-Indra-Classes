import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || 'super_secret_aic_jwt_token_key_102938',
      { expiresIn: '7d' } // Session valid for 7 days
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server login error.', error: error.message });
  }
});

// GET /api/auth/verify
router.get('/verify', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin profile not found.' });
    }
    res.json({ admin });
  } catch (error) {
    res.status(500).json({ message: 'Token verification server error.', error: error.message });
  }
});

export default router;
