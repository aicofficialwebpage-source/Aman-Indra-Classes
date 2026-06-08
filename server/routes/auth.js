import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';
import { sendForgotPasswordOTPEmail, sendTwoFactorAuthEmail } from '../config/email.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  // Strictly restrict login to the configured ADMIN_EMAIL (defaulting to aicofficialwebpage@gmail.com)
  const allowedAdminEmail = (process.env.ADMIN_EMAIL || 'aicofficialwebpage@gmail.com').toLowerCase();
  if (email.trim().toLowerCase() !== allowedAdminEmail) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  try {
    const admin = await Admin.findOne({ email: allowedAdminEmail });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Trigger Two-Factor Authentication (2FA) if enabled
    if (admin.is2FAEnabled) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      admin.twoFactorOtp = otp;
      admin.twoFactorOtpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
      await admin.save();

      try {
        await sendTwoFactorAuthEmail(admin.email, otp);
      } catch (emailErr) {
        console.error('Failed to send 2FA email:', emailErr);
        // We log the error but still proceed so the client gets transitioned to the 2FA screen
      }

      return res.json({
        require2FA: true,
        email: admin.email
      });
    }

    // Standard Direct Login if 2FA is disabled (fallback)
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

// POST /api/auth/verify-2fa
router.post('/verify-2fa', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'Please provide both email and 2FA code.' });
  }

  // Strictly restrict 2FA verify to the configured ADMIN_EMAIL
  const allowedAdminEmail = (process.env.ADMIN_EMAIL || 'aicofficialwebpage@gmail.com').toLowerCase();
  if (email.trim().toLowerCase() !== allowedAdminEmail) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  try {
    const admin = await Admin.findOne({ email: allowedAdminEmail });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (!admin.twoFactorOtp || !admin.twoFactorOtpExpires || admin.twoFactorOtpExpires < Date.now()) {
      return res.status(401).json({ message: 'Verification code has expired or is invalid. Please request a new one.' });
    }

    if (admin.twoFactorOtp !== code) {
      return res.status(401).json({ message: 'Invalid verification code.' });
    }

    // Clear 2FA OTP codes on successful verification
    admin.twoFactorOtp = null;
    admin.twoFactorOtpExpires = null;
    await admin.save();

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
    res.status(500).json({ message: '2FA verification server error.', error: error.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Please provide email address.' });
  }

  // Strictly restrict password reset requests to the configured ADMIN_EMAIL
  const allowedAdminEmail = (process.env.ADMIN_EMAIL || 'aicofficialwebpage@gmail.com').toLowerCase();
  if (email.trim().toLowerCase() !== allowedAdminEmail) {
    // Return generic success to prevent email verification probing/enumeration
    return res.json({ message: 'Verification code sent if the email is registered.' });
  }

  try {
    const admin = await Admin.findOne({ email: allowedAdminEmail });
    if (!admin) {
      return res.status(404).json({ message: 'Admin account not found.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetOtp = otp;
    admin.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await admin.save();

    try {
      await sendForgotPasswordOTPEmail(admin.email, otp);
    } catch (emailErr) {
      console.error('Failed to send forgot password email:', emailErr);
      return res.status(500).json({ message: 'Failed to send verification email. Please try again later.' });
    }

    res.json({ message: 'Verification code sent if the email is registered.' });
  } catch (error) {
    res.status(500).json({ message: 'Forgot password server error.', error: error.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Please provide email, verification code, and new password.' });
  }

  // Strictly restrict password resets to the configured ADMIN_EMAIL
  const allowedAdminEmail = (process.env.ADMIN_EMAIL || 'aicofficialwebpage@gmail.com').toLowerCase();
  if (email.trim().toLowerCase() !== allowedAdminEmail) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  try {
    const admin = await Admin.findOne({ email: allowedAdminEmail });
    if (!admin) {
      return res.status(404).json({ message: 'Admin account not found.' });
    }

    if (!admin.resetOtp || !admin.resetOtpExpires || admin.resetOtpExpires < Date.now()) {
      return res.status(400).json({ message: 'Verification code has expired or is invalid. Please request a new one.' });
    }

    if (admin.resetOtp !== otp) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    // Save the new password (pre-save middleware handles hashing)
    admin.password = newPassword;
    admin.resetOtp = null;
    admin.resetOtpExpires = null;
    await admin.save();

    // Create system notification for security audit trail
    try {
      const notification = new Notification({
        title: 'Security Alert',
        message: 'The administrator account password was successfully reset using OTP verification.',
        type: 'system'
      });
      await notification.save();
    } catch (notifErr) {
      console.error('Failed to log password reset notification:', notifErr);
    }

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Reset password server error.', error: error.message });
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

