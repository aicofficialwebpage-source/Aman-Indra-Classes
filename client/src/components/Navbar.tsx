import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Award, LogOut, LayoutDashboard, Calendar, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsOpen(false);
    
    // If not on home page, navigate to home and then scroll
    if (location.pathname !== '/') {
      navigate('/');
      // Delay slightly to allow homepage mounting
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 transition-all duration-300">
      {/* 1. Top Admissions Bar */}
      <div className="bg-gradient-to-r from-brand-dark via-emerald-900 to-emerald-950 text-white py-2 px-4 text-center text-xs md:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 border-b border-brand-accent/20">
        <span className="inline-block w-2.5 h-2.5 bg-brand-accent rounded-full animate-ping" />
        <span>Admissions Open for 2026-27! Contact us to secure your seat.</span>
        <button 
          onClick={() => handleNavClick('contact')}
          className="underline hover:text-brand-accent transition-colors ml-2 font-bold cursor-pointer"
        >
          Apply Now &rarr;
        </button>
      </div>

      {/* 2. Glassmorphic Sticky Header */}
      <nav className={`w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-emerald-950/80 backdrop-blur-md shadow-md py-3 border-b border-slate-100 dark:border-emerald-900/20' 
          : 'bg-white dark:bg-emerald-950 py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand-dark dark:bg-brand-accent rounded-xl flex items-center justify-center text-brand-accent dark:text-brand-dark group-hover:scale-105 transition-transform duration-300">
              <Award size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-lg md:text-xl text-brand-dark dark:text-white tracking-tight block">
                AMAN INDRA
              </span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-brand-accent block -mt-1">
                CLASSES KANPUR
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 font-medium text-slate-600 dark:text-slate-300 text-sm">
            <button onClick={() => handleNavClick('achievers')} className="hover:text-brand-accent transition-colors cursor-pointer">Results</button>
            <button onClick={() => handleNavClick('programs')} className="hover:text-brand-accent transition-colors cursor-pointer">Programs</button>
            <button onClick={() => handleNavClick('why-aic')} className="hover:text-brand-accent transition-colors cursor-pointer">Why AIC</button>
            <button onClick={() => handleNavClick('faculty')} className="hover:text-brand-accent transition-colors cursor-pointer">Faculty</button>
            <button onClick={() => handleNavClick('notices')} className="hover:text-brand-accent transition-colors cursor-pointer">Notice Board</button>
            <Link to="/blogs" className="hover:text-brand-accent transition-colors">Blogs</Link>
            <button onClick={() => handleNavClick('contact')} className="hover:text-brand-accent transition-colors cursor-pointer">Contact</button>
          </div>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            {admin ? (
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-emerald-900/50 py-1.5 px-3 rounded-full border border-slate-200 dark:border-emerald-800/30">
                <Link 
                  to="/admin" 
                  className="flex items-center gap-1.5 text-xs font-bold text-brand-dark dark:text-white hover:text-brand-accent transition-colors"
                >
                  <LayoutDashboard size={14} />
                  CRM Panel
                </Link>
                <div className="w-px h-4 bg-slate-300 dark:bg-emerald-800" />
                <button 
                  onClick={logout}
                  className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-dark dark:hover:text-white transition-colors mr-2"
              >
                Admin Login
              </Link>
            )}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-emerald-900/60 dark:hover:bg-emerald-900 text-brand-dark dark:text-brand-accent transition-all duration-300 cursor-pointer"
              aria-label="Toggle theme"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>

            {/* Scholarship Test button removed */}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            {admin && (
              <Link 
                to="/admin" 
                className="p-2 bg-slate-100 dark:bg-emerald-900 text-brand-dark dark:text-white rounded-full border border-slate-200 dark:border-emerald-850 hover:text-brand-accent"
                title="Admin Panel"
              >
                <LayoutDashboard size={18} />
              </Link>
            )}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-dark dark:text-white p-2 hover:bg-slate-100 dark:hover:bg-emerald-900/40 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-emerald-950 border-b border-slate-100 dark:border-emerald-900/20 shadow-xl py-6 px-6 animate-slide-down">
            <div className="flex flex-col gap-4 font-semibold text-slate-700 dark:text-slate-200">
              <button onClick={() => handleNavClick('achievers')} className="text-left py-2 border-b border-slate-50 dark:border-emerald-900/10 hover:text-brand-accent cursor-pointer">Results & Achievers</button>
              <button onClick={() => handleNavClick('programs')} className="text-left py-2 border-b border-slate-50 dark:border-emerald-900/10 hover:text-brand-accent cursor-pointer">Academic Programs</button>
              <button onClick={() => handleNavClick('why-aic')} className="text-left py-2 border-b border-slate-50 dark:border-emerald-900/10 hover:text-brand-accent cursor-pointer">Why Choose Us</button>
              <button onClick={() => handleNavClick('faculty')} className="text-left py-2 border-b border-slate-50 dark:border-emerald-900/10 hover:text-brand-accent cursor-pointer">Expert Faculty</button>
              <button onClick={() => handleNavClick('notices')} className="text-left py-2 border-b border-slate-50 dark:border-emerald-900/10 hover:text-brand-accent cursor-pointer">Live Notice Board</button>
              <Link to="/blogs" onClick={() => setIsOpen(false)} className="py-2 border-b border-slate-50 dark:border-emerald-900/10 hover:text-brand-accent">Blog Articles</Link>
              <button onClick={() => handleNavClick('contact')} className="text-left py-2 border-b border-slate-50 dark:border-emerald-900/10 hover:text-brand-accent cursor-pointer">Contact & Location</button>
              
              {/* Mobile Theme Toggle Row */}
              <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-emerald-900/10">
                <span className="text-sm font-semibold">Theme Mode</span>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-slate-100 dark:bg-emerald-900 text-brand-dark dark:text-brand-accent text-xs font-bold transition-all duration-300"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon size={14} />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun size={14} />
                      Light Mode
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-emerald-900/20">
                <button 
                  onClick={() => { setIsOpen(false); handleNavClick('contact'); }}
                  className="bg-brand-accent hover:bg-brand-accentHover text-brand-dark py-3 px-6 rounded-xl shadow-md font-bold text-center w-full flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar size={16} />
                  Enquire Offline / Online
                </button>
                
                {admin ? (
                  <button 
                    onClick={() => { setIsOpen(false); logout(); }}
                    className="border-2 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 py-2.5 px-6 rounded-xl font-bold text-center w-full flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut size={16} />
                    Logout Admin
                  </button>
                ) : (
                  <Link 
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="border-2 border-slate-200 dark:border-emerald-900/40 hover:bg-slate-50 dark:hover:bg-emerald-900/30 text-slate-700 dark:text-slate-300 py-2.5 px-6 rounded-xl font-bold text-center w-full block"
                  >
                    Admin CRM Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
