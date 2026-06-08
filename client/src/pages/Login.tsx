import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ShieldCheck, AlertCircle, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Security view modes
  const [viewMode, setViewMode] = useState<'login' | 'mfa' | 'forgot' | 'reset'>('login');
  
  // OTP & Password Reset States
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Resend Timer Countdown State
  const [resendTimer, setResendTimer] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const { admin, login } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect directly to dashboard
  useEffect(() => {
    if (admin) {
      navigate('/admin');
    }
  }, [admin, navigate]);



  // Handle countdown interval for resending codes
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);

    try {
      const data = await api.post('/auth/login', { email, password });
      
      if (data.require2FA) {
        setViewMode('mfa');
        setResendTimer(60); // Start 1 minute countdown
        setMessage('A 6-digit verification code (OTP) has been sent to your admin email address.');
      } else {
        login(data.token, data.admin);
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otpCode) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      const data = await api.post('/auth/verify-2fa', { email, code: otpCode });
      login(data.token, data.admin);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired 2FA code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend2FA = async () => {
    if (loading || resendTimer > 0) return;
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await api.post('/auth/resend-2fa', { email });
      setResendTimer(60); // Restart 1 minute countdown
      setMessage('A new verification code (OTP) has been sent to your admin email.');
      setOtpCode('');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your administrator email address.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setViewMode('reset');
      setResendTimer(60); // Start 1 minute countdown
      setMessage('A password reset verification code has been sent to your admin email.');
    } catch (err: any) {
      setError(err.message || 'Failed to request reset code. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendResetOTP = async () => {
    if (loading || resendTimer > 0) return;
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await api.post('/auth/forgot-password', { email });
      setResendTimer(60); // Restart 1 minute countdown
      setMessage('A new password reset code has been sent to your admin email.');
      setOtpCode('');
    } catch (err: any) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otpCode || !newPassword || !confirmPassword) {
      setError('Please fill in all the fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Security password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', { email, otp: otpCode, newPassword });
      setViewMode('login');
      setMessage('Your password has been reset successfully! You can now log in.');
      setPassword('');
      setOtpCode('');
      setNewPassword('');
      setConfirmPassword('');
      setResendTimer(0);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please check if the OTP is correct and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50 relative overflow-hidden">
      
      {/* Background accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-dark/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-100 p-8 rounded-3xl shadow-xl shadow-slate-200/50 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-dark text-brand-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <ShieldCheck size={26} className="stroke-[2]" />
          </div>
          <h2 className="font-extrabold text-2xl text-brand-dark tracking-tight">
            {viewMode === 'login' && 'Admin Portal Access'}
            {viewMode === 'mfa' && '2-Step Verification'}
            {viewMode === 'forgot' && 'Reset Password'}
            {viewMode === 'reset' && 'Create New Password'}
          </h2>
          <p className="text-xs text-brand-muted mt-1.5 px-2">
            {viewMode === 'login' && 'Log in to manage enquiries CRM, student results, faculty profiles, settings, and notices.'}
            {viewMode === 'mfa' && `We sent a 6-digit authorization code to ${email}. Enter it to continue.`}
            {viewMode === 'forgot' && 'Enter your admin email. If matched, we will send an OTP code to verify your identity.'}
            {viewMode === 'reset' && 'Enter the verification code sent to your email along with your new password.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-6 p-3.5 bg-green-50 border border-green-100 text-green-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-green-600" />
            <span>{message}</span>
          </div>
        )}

        {/* View Mode: Normal Login */}
        {viewMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5 text-sm">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-xs text-brand-dark" htmlFor="loginEmail">Email Address</label>
              <input
                id="loginEmail"
                type="email"
                placeholder="admin@amanindraclasses.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="border border-slate-200 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl transition-all text-slate-900 bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="font-bold text-xs text-brand-dark" htmlFor="loginPassword">Security Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setMessage('');
                    setViewMode('forgot');
                  }}
                  className="text-xs font-semibold text-brand-accent hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="loginPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="border border-slate-200 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 pr-11 rounded-xl w-full transition-all text-slate-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-dark p-1 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-brand-dark hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Authenticating Session...
                </>
              ) : (
                'Access CRM Dashboard'
              )}
            </button>
          </form>
        )}

        {/* View Mode: MFA Code */}
        {viewMode === 'mfa' && (
          <form onSubmit={handleVerify2FASubmit} className="flex flex-col gap-5 text-sm">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-xs text-brand-dark" htmlFor="mfaCode">Verification Code</label>
              <input
                id="mfaCode"
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                disabled={loading}
                className="border border-slate-200 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl text-center font-bold tracking-widest text-lg transition-all text-slate-900 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-brand-dark hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verifying Code...
                </>
              ) : (
                'Verify & Enter Dashboard'
              )}
            </button>

            <div className="text-center mt-2 flex flex-col gap-2">
              <button
                type="button"
                disabled={resendTimer > 0 || loading}
                onClick={handleResend2FA}
                className="text-xs font-semibold text-brand-accent hover:underline disabled:text-slate-400 disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
              >
                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend verification code'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setMessage('');
                  setViewMode('login');
                  setOtpCode('');
                  setResendTimer(0);
                }}
                className="text-xs text-slate-500 hover:text-brand-dark flex items-center justify-center gap-1 mx-auto font-semibold cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to credentials login
              </button>
            </div>
          </form>
        )}

        {/* View Mode: Forgot Password */}
        {viewMode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="flex flex-col gap-5 text-sm">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-xs text-brand-dark" htmlFor="forgotEmail">Admin Email Address</label>
              <input
                id="forgotEmail"
                type="email"
                placeholder="admin@amanindraclasses.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="border border-slate-200 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl transition-all text-slate-900 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-brand-dark hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating Code...
                </>
              ) : (
                'Request Verification OTP'
              )}
            </button>

            <div className="text-center mt-2">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setMessage('');
                  setViewMode('login');
                }}
                className="text-xs text-slate-500 hover:text-brand-dark flex items-center justify-center gap-1 mx-auto font-semibold cursor-pointer"
              >
                <ArrowLeft size={14} /> Cancel and go back
              </button>
            </div>
          </form>
        )}

        {/* View Mode: Reset Password */}
        {viewMode === 'reset' && (
          <form onSubmit={handleResetSubmit} className="flex flex-col gap-5 text-sm">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-xs text-brand-dark" htmlFor="resetOtp">Verification Code (OTP)</label>
              <input
                id="resetOtp"
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                disabled={loading}
                className="border border-slate-200 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl text-center font-bold tracking-widest text-lg transition-all text-slate-900 bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-xs text-brand-dark" htmlFor="newPassword">New Security Password</label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  className="border border-slate-200 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 pr-11 rounded-xl w-full transition-all text-slate-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-dark p-1 cursor-pointer"
                  title={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-xs text-brand-dark" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="border border-slate-200 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl w-full transition-all text-slate-900 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-brand-dark hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving Password...
                </>
              ) : (
                'Save Password & Login'
              )}
            </button>

            <div className="text-center mt-2 flex flex-col gap-2">
              <button
                type="button"
                disabled={resendTimer > 0 || loading}
                onClick={handleResendResetOTP}
                className="text-xs font-semibold text-brand-accent hover:underline disabled:text-slate-400 disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
              >
                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend verification code'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setMessage('');
                  setViewMode('login');
                  setOtpCode('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setResendTimer(0);
                }}
                className="text-xs text-slate-500 hover:text-brand-dark flex items-center justify-center gap-1 mx-auto font-semibold cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to login
              </button>
            </div>
          </form>
        )}

        <div className="text-center mt-6 pt-6 border-t border-slate-100">
          <button 
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-slate-500 hover:text-brand-accent underline cursor-pointer"
          >
            &larr; Return to main site
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;
