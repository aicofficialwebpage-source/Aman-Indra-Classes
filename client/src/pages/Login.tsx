import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { admin, login } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect directly to dashboard
  useEffect(() => {
    if (admin) {
      navigate('/admin');
    }
  }, [admin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);

    try {
      const data = await api.post('/auth/login', { email, password });
      login(data.token, data.admin);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
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
            Admin Portal Access
          </h2>
          <p className="text-xs text-brand-muted mt-1.5">
            Log in to manage enquiries CRM, student results, faculty profiles, settings, and notices.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm">
          
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-xs text-brand-dark" htmlFor="loginEmail">Email Address</label>
            <input
              id="loginEmail"
              type="email"
              placeholder="admin@amanindraclasses.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="border border-slate-200 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-xs text-brand-dark" htmlFor="loginPassword">Security Password</label>
            <div className="relative">
              <input
                id="loginPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="border border-slate-200 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 pr-11 rounded-xl w-full transition-all"
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
