import express from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import Admin from '../models/Admin.js';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';
import { sendForgotPasswordOTPEmail, sendTwoFactorAuthEmail } from '../config/email.js';

const router = express.Router();

// 1. Configure strict rate limiters for security-sensitive endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 attempts
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

const verify2faLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many verification attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many password reset requests. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many password reset attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  const allowedAdminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
  if (!allowedAdminEmail) {
    console.error('[Security Alert] Admin email is not configured in environment variables.');
    return res.status(500).json({ message: 'Internal server configuration error.' });
  }

  // Audit Log: Login attempt initiated
  console.log(`[Audit Log] Login attempt initiated for: ${email} from IP: ${req.ip}`);

  if (email.trim().toLowerCase() !== allowedAdminEmail) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  try {
    const admin = await Admin.findOne({ email: allowedAdminEmail });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 2. Check if the account is currently locked out
    if (admin.lockUntil && admin.lockUntil > Date.now()) {
      console.warn(`[Audit Log] Blocked login attempt on locked admin account: ${email} from IP: ${req.ip}`);
      
      // Log DB security alert
      const notification = new Notification({
        title: 'Security Alert',
        message: `Blocked login attempt on locked admin account from IP ${req.ip}.`,
        type: 'system'
      });
      await notification.save();

      return res.status(423).json({ message: 'Account is temporarily locked. Please try again later.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      // Increment failed attempts and trigger lockout if >= 5
      admin.loginAttempts = (admin.loginAttempts || 0) + 1;
      let lockoutTriggered = false;

      if (admin.loginAttempts >= 5) {
        admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes lockout
        lockoutTriggered = true;
      }

      await admin.save();

      console.warn(`[Audit Log] Failed login attempt ${admin.loginAttempts}/5 for ${email} from IP: ${req.ip}`);

      // Log DB failed attempt
      const notification = new Notification({
        title: 'Security Alert',
        message: lockoutTriggered 
          ? `Admin account locked out for 15 minutes due to 5 consecutive failed attempts from IP ${req.ip}.`
          : `Failed admin login attempt (${admin.loginAttempts}/5) from IP ${req.ip}.`,
        type: 'system'
      });
      await notification.save();

      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Reset attempts on successful password verification
    admin.loginAttempts = 0;
    admin.lockUntil = null;
    await admin.save();

    // Trigger Two-Factor Authentication (2FA) if enabled
    if (admin.is2FAEnabled) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      admin.twoFactorOtp = otp;
      admin.twoFactorOtpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
      await admin.save();

      try {
        await sendTwoFactorAuthEmail(admin.email, otp);
        console.log(`[Audit Log] 2FA OTP code generated and emailed to: ${admin.email}`);
      } catch (emailErr) {
        console.error('Failed to send 2FA email:', emailErr);
        return res.status(500).json({ message: 'Failed to send 2FA verification email.' });
      }

      return res.json({
        require2FA: true,
        email: admin.email
      });
    }

    // Standard Direct Login if 2FA is disabled (fallback)
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Session valid for 7 days
    );

    console.log(`[Audit Log] Admin direct login successful: ${email} from IP: ${req.ip}`);

    // Log DB session start
    const notification = new Notification({
      title: 'Admin Session Started',
      message: `Admin user logged in (direct) from IP ${req.ip}.`,
      type: 'system'
    });
    await notification.save();

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Server login error:', error);
    res.status(500).json({ message: 'Server login error.' });
  }
});

// POST /api/auth/verify-2fa
router.post('/verify-2fa', verify2faLimiter, async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'Please provide both email and 2FA code.' });
  }

  const allowedAdminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
  if (email.trim().toLowerCase() !== allowedAdminEmail) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  try {
    const admin = await Admin.findOne({ email: allowedAdminEmail });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (!admin.twoFactorOtp || !admin.twoFactorOtpExpires || admin.twoFactorOtpExpires < Date.now()) {
      console.warn(`[Audit Log] Expired 2FA verify attempt for: ${email} from IP: ${req.ip}`);
      return res.status(401).json({ message: 'Verification code has expired or is invalid. Please request a new one.' });
    }

    if (admin.twoFactorOtp !== code) {
      console.warn(`[Audit Log] Incorrect 2FA verification attempt for: ${email} from IP: ${req.ip}`);

      // Log DB failed 2FA
      const notification = new Notification({
        title: 'Security Alert',
        message: `Failed 2FA verification attempt from IP ${req.ip}.`,
        type: 'system'
      });
      await notification.save();

      return res.status(401).json({ message: 'Invalid verification code.' });
    }

    // Clear 2FA OTP codes on successful verification
    admin.twoFactorOtp = null;
    admin.twoFactorOtpExpires = null;
    admin.loginAttempts = 0; // Double-ensure reset on full auth flow completion
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`[Audit Log] Admin 2FA verification successful: ${email} from IP: ${req.ip}`);

    // Log DB session start
    const notification = new Notification({
      title: 'Admin Session Started',
      message: `Admin user logged in (2FA verified) from IP ${req.ip}.`,
      type: 'system'
    });
    await notification.save();

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('2FA verification server error:', error);
    res.status(500).json({ message: '2FA verification server error.' });
  }
});

// POST /api/auth/resend-2fa
router.post('/resend-2fa', verify2faLimiter, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Please provide email address.' });
  }

  const allowedAdminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
  if (email.trim().toLowerCase() !== allowedAdminEmail) {
    return res.json({ message: 'A new verification code has been sent.' });
  }

  try {
    const admin = await Admin.findOne({ email: allowedAdminEmail });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.twoFactorOtp = otp;
    admin.twoFactorOtpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
    await admin.save();

    try {
      await sendTwoFactorAuthEmail(admin.email, otp);
      console.log(`[Audit Log] 2FA OTP code resent to: ${admin.email}`);
    } catch (emailErr) {
      console.error('Failed to send 2FA email:', emailErr);
      return res.status(500).json({ message: 'Failed to send verification email. Please try again later.' });
    }

    res.json({ message: 'A new verification code has been sent.' });
  } catch (error) {
    console.error('Resend 2FA error:', error);
    res.status(500).json({ message: 'Resend 2FA error.' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPasswordLimiter, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Please provide email address.' });
  }

  const allowedAdminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
  if (email.trim().toLowerCase() !== allowedAdminEmail) {
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

    console.log(`[Audit Log] Password reset OTP requested for: ${email} from IP: ${req.ip}`);

    // Log DB security alert
    const notification = new Notification({
      title: 'Security Alert',
      message: `Password reset OTP requested for admin account from IP ${req.ip}.`,
      type: 'system'
    });
    await notification.save();

    try {
      await sendForgotPasswordOTPEmail(admin.email, otp);
    } catch (emailErr) {
      console.error('Failed to send forgot password email:', emailErr);
      return res.status(500).json({ message: 'Failed to send verification email. Please try again later.' });
    }

    res.json({ message: 'Verification code sent if the email is registered.' });
  } catch (error) {
    console.error('Forgot password server error:', error);
    res.status(500).json({ message: 'Forgot password server error.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', resetPasswordLimiter, async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Please provide email, verification code, and new password.' });
  }

  const allowedAdminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
  if (email.trim().toLowerCase() !== allowedAdminEmail) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  // 3. Enforce strong password complexity validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({ 
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' 
    });
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
      console.warn(`[Audit Log] Failed password reset OTP attempt for: ${email} from IP: ${req.ip}`);
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    // Save the new password (pre-save middleware handles hashing)
    admin.password = newPassword;
    admin.resetOtp = null;
    admin.resetOtpExpires = null;
    admin.loginAttempts = 0; // Clear attempts on password reset
    admin.lockUntil = null;
    await admin.save();

    console.log(`[Audit Log] Password reset successful for admin: ${email} from IP: ${req.ip}`);

    // Create system notification for security audit trail
    const notification = new Notification({
      title: 'Security Alert',
      message: `The administrator account password was successfully reset using OTP verification from IP ${req.ip}.`,
      type: 'system'
    });
    await notification.save();

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Reset password server error:', error);
    res.status(500).json({ message: 'Reset password server error.' });
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
    console.error('Token verification server error:', error);
    res.status(500).json({ message: 'Token verification server error.' });
  }
});

export default router;
