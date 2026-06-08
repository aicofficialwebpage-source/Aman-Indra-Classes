import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Award, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.553a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.553 9.388.553 9.388.553s7.518 0 9.388-.553a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);


export const Footer: React.FC = () => {
  const { settings } = useSettings();

  const phone = settings.contactPhone || '+91 91400 64194';
  const email = settings.contactEmail || 'aicofficialwebpage@gmail.com';
  const address = settings.contactAddress || 'Ratanlal Nagar Main Road, High Income Grade, Neemeshwar MahaMandir Society, Ratan Lal Nagar, Kanpur, Uttar Pradesh – 208022';
  const hours = settings.workingHours || 'Monday - Saturday: 11:00 AM - 8:00 PM | Sunday: 9:00 AM - 1:00 PM';
  
  const cleanPhone = phone.replace(/[^0-9+]/g, '');

  return (
    <footer className="bg-brand-dark text-slate-300 pt-16 pb-8 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Brand details */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-900/35 rounded-lg flex items-center justify-center text-brand-accent border border-emerald-800/35">
              <Award size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-base text-white tracking-tight block">
                AMAN INDRA
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-accent block -mt-1">
                CLASSES KANPUR
              </span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-400 mt-2">
            Where Kanpur's Toppers Build Their Foundation. Providing quality education for Class 6–12, IIT-JEE, and NEET aspirants since 2014.
          </p>
          <div className="flex items-center gap-3 mt-4">
            {settings.socialFacebook && (
              <a 
                href={settings.socialFacebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 bg-emerald-900/35 hover:bg-brand-accent hover:text-brand-dark rounded-full flex items-center justify-center transition-colors border border-emerald-800/30"
                aria-label="Facebook Page"
              >
                <FacebookIcon />
              </a>
            )}
            {settings.socialInstagram && (
              <a 
                href={settings.socialInstagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 bg-emerald-900/35 hover:bg-brand-accent hover:text-brand-dark rounded-full flex items-center justify-center transition-colors border border-emerald-800/30"
                aria-label="Instagram Page"
              >
                <InstagramIcon />
              </a>
            )}
            {settings.socialYoutube && (
              <a 
                href={settings.socialYoutube} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 bg-emerald-900/35 hover:bg-brand-accent hover:text-brand-dark rounded-full flex items-center justify-center transition-colors border border-emerald-800/30"
                aria-label="YouTube Channel"
              >
                <YoutubeIcon />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6 tracking-wide">Quick Links</h3>
          <ul className="flex flex-col gap-3.5 text-sm">
            <li>
              <a href="#achievers" className="hover:text-brand-accent transition-colors">Results & Achievers</a>
            </li>
            <li>
              <a href="#programs" className="hover:text-brand-accent transition-colors">Academic Programs</a>
            </li>
            <li>
              <a href="#why-aic" className="hover:text-brand-accent transition-colors">Why Choose Us</a>
            </li>
            <li>
              <a href="#faculty" className="hover:text-brand-accent transition-colors">Our Faculty Profiles</a>
            </li>
            <li>
              <a href="#notices" className="hover:text-brand-accent transition-colors">Live Notice Board</a>
            </li>
            <li>
              <Link to="/blogs" className="hover:text-brand-accent transition-colors">Prep Blogs & Articles</Link>
            </li>
            <li>
              <a href="#contact" className="hover:text-brand-accent transition-colors">Get In Touch</a>
            </li>
          </ul>
        </div>

        {/* Programs List */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-6 tracking-wide">Our Programs</h3>
          <ul className="flex flex-col gap-3.5 text-sm text-slate-400">
            <li>
              <span className="text-slate-300 font-medium block">Foundation Program</span>
              <span className="text-xs">Classes 6th, 7th & 8th (Science & Maths)</span>
            </li>
            <li>
              <span className="text-slate-300 font-medium block">Academic Excellence</span>
              <span className="text-xs">Classes 9th & 10th (Board Foundation)</span>
            </li>
            <li>
              <span className="text-slate-300 font-medium block">Board Preparation</span>
              <span className="text-xs">Classes 11th & 12th (Physics, Chem, Maths, Bio)</span>
            </li>
            <li>
              <span className="text-slate-300 font-medium block">IIT-JEE & NEET Focus</span>
              <span className="text-xs">Droppers and Regular Targets</span>
            </li>
          </ul>
        </div>

        {/* Office Contact Details */}
        <div className="flex flex-col gap-5">
          <h3 className="text-white font-semibold text-lg mb-1 tracking-wide">Contact Details</h3>
          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex gap-3">
              <MapPin size={18} className="text-brand-accent shrink-0 mt-0.5" />
              <span>{address}</span>
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="text-brand-accent shrink-0" />
              <a href={`tel:${cleanPhone}`} className="hover:text-white transition-colors">{phone}</a>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="text-brand-accent shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
            </li>
            <li className="flex gap-3">
              <Clock size={18} className="text-brand-accent shrink-0 mt-0.5" />
              <span className="text-xs text-slate-400 leading-relaxed">{hours}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-emerald-950 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <span>© {new Date().getFullYear()} Aman Indra Classes (AIC) Ratan Lal Nagar, Kanpur. All rights reserved.</span>
        <div className="flex gap-6">
          <Link to="/login" className="hover:text-slate-300 transition-colors">Admin Login</Link>
          <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
