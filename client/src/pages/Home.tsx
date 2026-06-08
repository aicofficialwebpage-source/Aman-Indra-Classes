import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Phone, ShieldCheck, GraduationCap, 
  MapPin, Mail, Clock, Award, CheckCircle 
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import api from '../utils/api';

// Components
import StatCounters from '../components/StatCounters';
import TopperCard from '../components/TopperCard';
import type { Achiever } from '../components/TopperCard';
import SuccessJourney from '../components/SuccessJourney';
import NoticeBoard from '../components/NoticeBoard';
import TestimonialCarousel from '../components/TestimonialCarousel';
import GallerySection from '../components/GallerySection';
import LeadForm from '../components/LeadForm';

interface FacultyMember {
  _id: string;
  name: string;
  photo?: string;
  subject: string;
  qualification: string;
  experience: string;
  bio?: string;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  createdAt: string;
}

export const Home: React.FC = () => {
  const { settings } = useSettings();
  const [achievers, setAchievers] = useState<Achiever[]>([]);
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loadingAchievers, setLoadingAchievers] = useState(true);

  // Load section CMS data from backend
  useEffect(() => {
    // Set Page Title
    document.title = settings.seoMetaTitle || 'Aman Indra Classes (AIC) - Govind Nagar, Kanpur';

    // Helper functions to update SEO meta tags dynamically in client-side router
    const updateMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updateOGTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    if (settings.seoMetaDescription) {
      updateMetaTag('description', settings.seoMetaDescription);
      updateOGTag('og:description', settings.seoMetaDescription);
      updateOGTag('twitter:description', settings.seoMetaDescription);
    }
    if (settings.seoKeywords) {
      updateMetaTag('keywords', settings.seoKeywords);
    }
    updateOGTag('og:title', document.title);
    updateOGTag('twitter:title', document.title);
    updateOGTag('og:type', 'website');

    const loadData = async () => {
      try {
        const achieversData = await api.get('/achievers');
        setAchievers(achieversData.slice(0, 4)); // Show top 4
      } catch (err) {
        console.warn('Achievers list load error:', err);
      } finally {
        setLoadingAchievers(false);
      }

      try {
        const facultyData = await api.get('/faculty');
        setFaculty(facultyData);
      } catch (err) {
        console.warn('Faculty list load error:', err);
      }

      try {
        const blogsData = await api.get('/blogs');
        setBlogs(blogsData.slice(0, 3)); // Show latest 3
      } catch (err) {
        console.warn('Blogs highlights load error:', err);
      }
    };

    loadData();
  }, [settings]);

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getImageUrl = (photoUrl?: string, defaultUrl = '') => {
    if (!photoUrl) return defaultUrl;
    if (photoUrl.startsWith('http')) return photoUrl;
    const serverOrigin = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    return `${serverOrigin}${photoUrl}`;
  };

  return (
    <div className="overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-brand-light/40 via-white to-brand-light/60 dark:from-emerald-950 dark:via-emerald-900/20 dark:to-emerald-950 px-4 md:px-8 py-20 transition-colors duration-300">
        
        {/* Dynamic decorative backdrop grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-brand-accent/5 dark:bg-brand-accent/3 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-dark/5 dark:bg-emerald-900/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
            
            {/* Tagline */}
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className="bg-brand-accent/15 border border-brand-accent/30 text-brand-accent dark:text-brand-accent text-[10px] md:text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full">
                ★ Kanpur's Premier Coaching Institute
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-extrabold text-3.5xl md:text-5xl lg:text-6xl text-brand-dark dark:text-white tracking-tight leading-tight">
              {settings.heroHeadline || 'Transform Potential Into Results'}
            </h1>

            {/* Subheadline */}
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base lg:text-lg max-w-xl leading-relaxed mx-auto lg:mx-0">
              {settings.heroSubheadline || "Kanpur's Trusted Coaching Institute for Classes 6–12, IIT-JEE & NEET Preparation Since 2014."}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-3">
              <button 
                onClick={() => scrollToElement('contact')}
                className="btn-primary w-full sm:w-auto cursor-pointer"
              >
                Book Free Counseling
                <ArrowRight size={16} />
              </button>
              <button 
                onClick={() => scrollToElement('achievers')}
                className="btn-secondary w-full sm:w-auto cursor-pointer"
              >
                View Results
              </button>
            </div>

            {/* Trust badge list */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 border-t border-slate-100 dark:border-emerald-900/30 pt-8 text-left max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-start gap-2">
                <ShieldCheck size={18} className="text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">1000+ Students</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Mentored Since 2014</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Award size={18} className="text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">10+ Years</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Of Educational Glory</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <GraduationCap size={18} className="text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">Expert Faculty</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">IITian & PhD Guides</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={18} className="text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">Proven System</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Custom Study Sheets</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Hero Image Card Layout */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            <div className="relative w-full max-w-[360px] aspect-[4/5] bg-white dark:bg-emerald-900/35 border border-slate-100 dark:border-emerald-900/30 rounded-[32px] p-4 shadow-2xl shadow-slate-200/60 dark:shadow-none rotate-2 hover:rotate-0 transition-transform duration-500 overflow-hidden">
              <img
                src={getImageUrl(settings.heroImageUrl, "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600")}
                alt="Coaching study environment"
                className="w-full h-full object-cover rounded-2xl"
              />
              
              {/* Topper overlay widget banner */}
              <div className="absolute bottom-8 left-8 right-8 glass-card border border-white/40 dark:border-emerald-800/30 p-4 rounded-2xl shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-accent text-brand-dark font-extrabold text-xs rounded-full flex items-center justify-center">
                  99.2%
                </div>
                <div>
                  <span className="font-bold text-slate-800 dark:text-white text-xs block">Shraddha Chaturvedi</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-300">Swarup Public School Topper</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. STATS SECTION */}
      <StatCounters />

      {/* 3. ACHIEVERS & RESULTS SECTION */}
      <section id="achievers" className="section-padding">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block bg-brand-dark/5 dark:bg-brand-accent/15 border border-brand-dark/10 dark:border-brand-accent/30 text-brand-dark dark:text-brand-accent text-[10px] font-extrabold uppercase tracking-widest py-1 px-4.5 rounded-full mb-3 animate-pulse">
            Hall Of Fame
          </span>
          <h2 className="font-extrabold text-3xl md:text-4xl text-brand-dark dark:text-white tracking-tight mb-4">
            Kanpur's Toppers & Achievers
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Consistently producing school toppers, high board scores, and prestigious IIT-JEE / NEET ranks. Results that speak for our rigorous curriculum.
          </p>
        </div>

        {loadingAchievers ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-slate-100 aspect-[3/4] rounded-3xl" />
            ))}
          </div>
        ) : achievers.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 border border-slate-100 rounded-3xl max-w-sm mx-auto text-slate-500 font-semibold text-xs">
            Academic achievements list populated dynamically.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievers.map((ach) => (
              <TopperCard key={ach._id} achiever={ach} />
            ))}
          </div>
        )}
      </section>

      {/* 4. PROGRAMS SECTION */}
      <section id="programs" className="bg-slate-50/60 dark:bg-brand-dark text-brand-dark dark:text-white border-y border-slate-100 dark:border-emerald-950/20 py-20 px-4 md:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block bg-brand-dark/5 dark:bg-brand-accent/15 border border-brand-dark/10 dark:border-brand-accent/30 text-brand-dark dark:text-brand-accent text-[10px] font-extrabold uppercase tracking-widest py-1 px-4.5 rounded-full mb-3">
              Academic Curriculums
            </span>
            <h2 className="font-extrabold text-3xl md:text-4xl text-brand-dark dark:text-white tracking-tight mb-4">
              Programs Customized for Every Grade
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Whether building foundational science principles or refining final test strategies for medical/engineering competitive exams, we have targeted pathways.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Foundation */}
            <div className="bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 rounded-3xl p-7 shadow-xl hover:shadow-2xl hover:border-slate-200 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-orange-600 bg-orange-50 dark:text-orange-300 dark:bg-orange-950/40 dark:border-orange-900/30 py-0.5 px-3 rounded-full border border-orange-100">Grade 6-8</span>
                <h3 className="font-extrabold text-xl text-brand-dark dark:text-white mt-4 mb-2">Foundation Program</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Build strong intuitive grasp of Mathematics and Science basics. Perfect for clearing conceptual hurdles early.
                </p>
                <div className="border-t border-slate-100 dark:border-emerald-800/30 pt-5 flex flex-col gap-2.5 mb-6 text-xs text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2">✔ Mathematics & Basic Science</span>
                  <span className="flex items-center gap-2">✔ Logical Reasoning & Aptitude sheets</span>
                  <span className="flex items-center gap-2">✔ Creative problem solving approach</span>
                </div>
              </div>
              <button onClick={() => scrollToElement('contact')} className="btn-secondary w-full text-xs py-2.5 cursor-pointer">Enquire Program</button>
            </div>

            {/* Card 2: Academic Excellence */}
            <div className="bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 rounded-3xl p-7 shadow-xl hover:shadow-2xl hover:border-slate-200 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/40 dark:border-blue-900/30 py-0.5 px-3 rounded-full border border-blue-100">Grade 9-10</span>
                <h3 className="font-extrabold text-xl text-brand-dark dark:text-white mt-4 mb-2">Academic Excellence</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Prepare for board examinations and build a baseline for JEE/NEET prep. Detailed NCERT coverage.
                </p>
                <div className="border-t border-slate-100 dark:border-emerald-800/30 pt-5 flex flex-col gap-2.5 mb-6 text-xs text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2">✔ Physics, Chemistry, Biology, Math</span>
                  <span className="flex items-center gap-2">✔ NCERT thoroughly with board models</span>
                  <span className="flex items-center gap-2">✔ Regular subjective answer-writing tests</span>
                </div>
              </div>
              <button onClick={() => scrollToElement('contact')} className="btn-secondary w-full text-xs py-2.5 cursor-pointer">Enquire Program</button>
            </div>

            {/* Card 3: Board Preparation */}
            <div className="bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 rounded-3xl p-7 shadow-xl hover:shadow-2xl hover:border-slate-200 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-purple-600 bg-purple-50 dark:text-purple-300 dark:bg-purple-950/40 dark:border-purple-900/30 py-0.5 px-3 rounded-full border border-purple-100">Grade 11-12</span>
                <h3 className="font-extrabold text-xl text-brand-dark dark:text-white mt-4 mb-2">Board Preparation</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Rigorous preparation of Physics, Chemistry, Maths, and Biology for CBSE/ISC exams with high percentage targets.
                </p>
                <div className="border-t border-slate-100 dark:border-emerald-800/30 pt-5 flex flex-col gap-2.5 mb-6 text-xs text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2">✔ Direct derivations, reactions, numericals</span>
                  <span className="flex items-center gap-2">✔ Previous 10 year paper reviews</span>
                  <span className="flex items-center gap-2">✔ Practical/viva guidelines support</span>
                </div>
              </div>
              <button onClick={() => scrollToElement('contact')} className="btn-secondary w-full text-xs py-2.5 cursor-pointer">Enquire Program</button>
            </div>

            {/* Card 4: IIT-JEE Preparation */}
            <div className="bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 rounded-3xl p-7 shadow-xl hover:shadow-2xl hover:border-slate-200 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-amber-700 bg-amber-50 border border-amber-100 dark:text-brand-accent dark:bg-emerald-950/40 dark:border-emerald-900/30 py-0.5 px-3 rounded-full">Competitive Target</span>
                <h3 className="font-extrabold text-xl text-brand-dark dark:text-white mt-4 mb-2">IIT-JEE Preparation</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  JEE Main & Advanced targeted batches. Solving tricks, shortcuts, mock tests, and intense worksheet reviews.
                </p>
                <div className="border-t border-slate-100 dark:border-emerald-800/30 pt-5 flex flex-col gap-2.5 mb-6 text-xs text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2">✔ Advanced Physics & Calculus concepts</span>
                  <span className="flex items-center gap-2">✔ Regular computer-based full mocks</span>
                  <span className="flex items-center gap-2">✔ All-India ranking predictions reports</span>
                </div>
              </div>
              <button onClick={() => scrollToElement('contact')} className="btn-primary w-full text-xs py-2.5 cursor-pointer">Register for Batch</button>
            </div>

            {/* Card 5: NEET Preparation */}
            <div className="bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 rounded-3xl p-7 shadow-xl hover:shadow-2xl hover:border-slate-200 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 bg-emerald-50 py-0.5 px-3 rounded-full border border-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-900/30">Medical Target</span>
                <h3 className="font-extrabold text-xl text-brand-dark dark:text-white mt-4 mb-2">NEET Preparation</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Targeted program for medical aspirants. In-depth Biology syllabus coverage along with Physics numerical solving skills.
                </p>
                <div className="border-t border-slate-100 dark:border-emerald-800/30 pt-5 flex flex-col gap-2.5 mb-6 text-xs text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2">✔ Organic named reactions charts</span>
                  <span className="flex items-center gap-2">✔ Complete NCERT Biology diagrams review</span>
                  <span className="flex items-center gap-2">✔ Speed analysis for NEET accuracy</span>
                </div>
              </div>
              <button onClick={() => scrollToElement('contact')} className="btn-primary w-full text-xs py-2.5 cursor-pointer">Register for Batch</button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY AMAN INDRA CLASSES */}
      <section id="why-aic" className="section-padding">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block bg-brand-dark/5 dark:bg-brand-accent/15 border border-brand-dark/10 dark:border-brand-accent/30 text-brand-dark dark:text-brand-accent text-[10px] font-extrabold uppercase tracking-widest py-1 px-4.5 rounded-full mb-3">
            Core Values
          </span>
          <h2 className="font-extrabold text-3xl md:text-4xl text-brand-dark dark:text-white tracking-tight mb-4">
            Why Aman Indra Classes?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Our classroom system is designed differently to build trust, inspire students, and guarantee concepts clear.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 hover:border-slate-200 dark:hover:border-emerald-700/50 hover:shadow-lg transition-all duration-300">
            <span className="font-bold text-slate-800 dark:text-white text-sm">✔ Experienced Faculty</span>
            <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">Classes led by senior teachers who understand board exam structures and competitive test patterns.</p>
          </div>
          <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 hover:border-slate-200 dark:hover:border-emerald-700/50 hover:shadow-lg transition-all duration-300">
            <span className="font-bold text-slate-800 dark:text-white text-sm">✔ Small Batch Attention</span>
            <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">Limiting seats per batch to guarantee that our instructors can personally monitor and interact with every student.</p>
          </div>
          <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 hover:border-slate-200 dark:hover:border-emerald-700/50 hover:shadow-lg transition-all duration-300">
            <span className="font-bold text-slate-800 dark:text-white text-sm">✔ Personal Mentorship</span>
            <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">Regular counseling and feedback checkpoints directly with Aman Sir to build study focus and discipline.</p>
          </div>
          <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 hover:border-slate-200 dark:hover:border-emerald-700/50 hover:shadow-lg transition-all duration-300">
            <span className="font-bold text-slate-800 dark:text-white text-sm">✔ Weekly Performance Tests</span>
            <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">Sunday exams tracking speed, calculation errors, and accuracy, helping to eliminate final exam fear.</p>
          </div>
          <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 hover:border-slate-200 dark:hover:border-emerald-700/50 hover:shadow-lg transition-all duration-300">
            <span className="font-bold text-slate-800 dark:text-white text-sm">✔ Doubt Solving Sessions</span>
            <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">Dedicated hours after regular classes to clarify tricky math steps and complex organic reactions.</p>
          </div>
          <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 hover:border-slate-200 dark:hover:border-emerald-700/50 hover:shadow-lg transition-all duration-300">
            <span className="font-bold text-slate-800 dark:text-white text-sm">✔ Exam-Oriented Material</span>
            <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">Carefully researched revision sheets, question sheets, and syllabus guides matching latest patterns.</p>
          </div>
          <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 hover:border-slate-200 dark:hover:border-emerald-700/50 hover:shadow-lg transition-all duration-300">
            <span className="font-bold text-slate-800 dark:text-white text-sm">✔ Progress Tracking</span>
            <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">Digital performance review charts shared with parents after every weekend test, ensuring mutual updates.</p>
          </div>
          <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 hover:border-slate-200 dark:hover:border-emerald-700/50 hover:shadow-lg transition-all duration-300">
            <span className="font-bold text-slate-800 dark:text-white text-sm">✔ Career Guidance</span>
            <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">Special sessions on stream selection in Class 10th and engineering/medical options after Class 12th.</p>
          </div>
        </div>
      </section>

      {/* 6. FACULTY SECTION */}
      <section id="faculty" className="bg-slate-50/50 dark:bg-brand-dark text-brand-dark dark:text-white border-y border-slate-100 dark:border-emerald-950/20 py-20 px-4 md:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block bg-brand-dark/5 dark:bg-brand-accent/15 border border-brand-dark/10 dark:border-brand-accent/30 text-brand-dark dark:text-brand-accent text-[10px] font-extrabold uppercase tracking-widest py-1 px-4.5 rounded-full mb-3">
              Mentors Group
            </span>
            <h2 className="font-extrabold text-3xl md:text-4xl text-brand-dark dark:text-white tracking-tight mb-4">
              Kanpur's Leading Educators
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Our core faculty team comprises expert mentors with engineering (IITs) and doctoral backgrounds, dedicated to student mentoring.
            </p>
          </div>

          {faculty.length === 0 ? (
            <div className="text-center py-10 bg-white/5 border border-emerald-900/30 rounded-3xl max-w-sm mx-auto text-slate-300 text-xs">
              Mentors list updated dynamically from admin CRM.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {faculty.map((f) => (
                <div 
                  key={f._id}
                  className="bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:border-slate-200 dark:hover:border-emerald-700/50 transition-all duration-300 group flex flex-col items-center text-center"
                >
                  <div className="w-44 h-44 rounded-full overflow-hidden mb-6 bg-slate-50 dark:bg-emerald-950 border-4 border-slate-100 dark:border-emerald-800/50 shadow-md shrink-0">
                    <img
                      src={getImageUrl(f.photo, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400')}
                      alt={f.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-extrabold text-lg text-brand-dark dark:text-white">{f.name}</h3>
                  <span className="text-xs font-bold text-brand-accent mt-0.5 block">{f.subject}</span>
                  <div className="bg-slate-50 dark:bg-emerald-950 py-1.5 px-4 rounded-xl border border-slate-100/60 dark:border-emerald-800/30 mt-3 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    {f.qualification} | {f.experience} Experience
                  </div>
                  {f.bio && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-4 border-t border-slate-100 dark:border-emerald-800/30 pt-4 w-full">
                      {f.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. CLASSROOM EXPERIENCE GALLERY */}
      <section className="section-padding">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block bg-brand-dark/5 dark:bg-brand-accent/15 border border-brand-dark/10 dark:border-brand-accent/30 text-brand-dark dark:text-brand-accent text-[10px] font-extrabold uppercase tracking-widest py-1 px-4.5 rounded-full mb-3">
            Campus Media
          </span>
          <h2 className="font-extrabold text-3xl md:text-4xl text-brand-dark dark:text-white tracking-tight mb-4">
            The Classroom Experience
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Take a visual tour inside our classrooms, events, results ceremonies, and interactive doubt-clearing sessions.
          </p>
        </div>

        <GallerySection />
      </section>

      {/* 8. STUDENT SUCCESS JOURNEY */}
      <section className="bg-slate-50/50 dark:bg-brand-dark text-brand-dark dark:text-white border-y border-slate-100 dark:border-emerald-950/20 py-20 px-4 md:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block bg-brand-dark/5 dark:bg-brand-accent/15 border border-brand-dark/10 dark:border-brand-accent/30 text-brand-dark dark:text-brand-accent text-[10px] font-extrabold uppercase tracking-widest py-1 px-4.5 rounded-full mb-3">
              Learning Cycle
            </span>
            <h2 className="font-extrabold text-3xl md:text-4xl text-brand-dark dark:text-white tracking-tight mb-4">
              Roadmap to Topper Status
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Our systematic approach guides students from assessment to ultimate academic excellence.
            </p>
          </div>

          <SuccessJourney />
        </div>
      </section>

      {/* 9. NOTICE BOARD & TESTIMONIALS (SIDE BY SIDE) */}
      <section className="section-padding grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Notice Board Left */}
        <div className="lg:col-span-5 w-full">
          <NoticeBoard />
        </div>

        {/* Testimonials Right */}
        <div className="lg:col-span-7 w-full flex flex-col gap-6">
          <div className="text-center lg:text-left">
            <span className="inline-block bg-brand-dark/5 dark:bg-brand-accent/15 border border-brand-dark/10 dark:border-brand-accent/30 text-brand-dark dark:text-brand-accent text-[10px] font-extrabold uppercase tracking-widest py-1 px-4.5 rounded-full mb-3">
              Appreciations
            </span>
            <h2 className="font-extrabold text-3xl text-brand-dark dark:text-white tracking-tight mb-4">
              What Parents & Students Say
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-xl">
              Authentic feedback from families who placed their trust in our methods and witnessed outstanding results.
            </p>
          </div>
          
          <TestimonialCarousel />
        </div>

      </section>



      {/* 11. BLOG INSIGHTS HIGHLIGHTS */}
      {blogs.length > 0 && (
        <section className="section-padding">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block bg-brand-dark/5 dark:bg-brand-accent/15 border border-brand-dark/10 dark:border-brand-accent/30 text-brand-dark dark:text-brand-accent text-[10px] font-extrabold uppercase tracking-widest py-1 px-4.5 rounded-full mb-3">
              Teacher Articles
            </span>
            <h2 className="font-extrabold text-3xl md:text-4xl text-brand-dark dark:text-white tracking-tight mb-4">
              Latest Preparation Blogs
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Read tips and strategic worksheets prepared directly by our senior coaching staff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((b) => (
              <div 
                key={b._id}
                className="bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 rounded-3xl overflow-hidden hover:shadow-xl hover:border-slate-200 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-44 bg-slate-50 dark:bg-emerald-950 overflow-hidden relative">
                    <img
                      src={getImageUrl(b.featuredImage, 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400')}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      {new Date(b.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </span>
                    <h3 className="font-extrabold text-sm md:text-base text-brand-dark dark:text-white group-hover:text-brand-accent transition-colors leading-snug tracking-tight mt-2 mb-2">
                      {b.title}
                    </h3>
                    {b.excerpt && <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">{b.excerpt}</p>}
                  </div>
                </div>
                <div className="p-6 pt-0 mt-2">
                  <Link 
                    to={`/blogs/${b.slug}`}
                    className="text-xs font-bold text-brand-dark dark:text-white group-hover:text-brand-accent transition-colors inline-flex items-center gap-1 hover:underline"
                  >
                    Read Article &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 12. CONTACT SECTION (FORM & MAP DETAILS) */}
      <section id="contact" className="bg-slate-50/50 dark:bg-brand-dark text-brand-dark dark:text-white border-t border-slate-100 dark:border-emerald-950/20 py-20 px-4 md:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details & Google Map Left */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <span className="inline-block bg-brand-dark/5 dark:bg-brand-accent/15 border border-brand-dark/10 dark:border-brand-accent/30 text-brand-dark dark:text-brand-accent text-[10px] font-extrabold uppercase tracking-widest py-1 px-4.5 rounded-full mb-3">
                Reach Us
              </span>
              <h2 className="font-extrabold text-3xl text-brand-dark dark:text-white tracking-tight mb-4">
                Our Office Location
              </h2>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Parents are welcome to visit our counseling desk. Schedule an offline counseling session and explore our library, classrooms, and study materials.
              </p>
            </div>

            {/* Icons Details list */}
            <div className="flex flex-col gap-4 text-xs md:text-sm">
              <div className="flex gap-3 bg-white dark:bg-emerald-900/25 p-4 rounded-2xl border border-slate-100 dark:border-emerald-800/30 shadow-sm">
                <MapPin size={18} className="text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-dark dark:text-white block mb-0.5 text-xs md:text-sm">Office Address</strong>
                  <span className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px] md:text-xs">
                    {settings.contactAddress || '123/456, Block C, Govind Nagar, Kanpur, Uttar Pradesh - 208006'}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 bg-white dark:bg-emerald-900/25 p-4 rounded-2xl border border-slate-100 dark:border-emerald-800/30 shadow-sm">
                <Phone size={18} className="text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-dark dark:text-white block mb-0.5 text-xs md:text-sm">Contact Number</strong>
                  <a href={`tel:${(settings.contactPhone || '+91 99361 74852').replace(/[^0-9+]/g, '')}`} className="text-slate-600 dark:text-slate-300 hover:text-brand-accent text-[11px] md:text-xs">
                    {settings.contactPhone || '+91 99361 74852'}
                  </a>
                </div>
              </div>
              <div className="flex gap-3 bg-white dark:bg-emerald-900/25 p-4 rounded-2xl border border-slate-100 dark:border-emerald-800/30 shadow-sm">
                <Mail size={18} className="text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-dark dark:text-white block mb-0.5 text-xs md:text-sm">Official Email</strong>
                  <a href={`mailto:${settings.contactEmail || 'admissions@amanindraclasses.com'}`} className="text-slate-600 dark:text-slate-300 hover:text-brand-accent text-[11px] md:text-xs">
                    {settings.contactEmail || 'admissions@amanindraclasses.com'}
                  </a>
                </div>
              </div>
              <div className="flex gap-3 bg-white dark:bg-emerald-900/25 p-4 rounded-2xl border border-slate-100 dark:border-emerald-800/30 shadow-sm">
                <Clock size={18} className="text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-brand-dark dark:text-white block mb-0.5 text-xs md:text-sm">Working Hours</strong>
                  <span className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px] md:text-xs">
                    {settings.workingHours || 'Monday - Saturday: 11:00 AM - 8:00 PM | Sunday: 9:00 AM - 1:00 PM'}
                  </span>
                </div>
              </div>
            </div>

            {/* Google Map Embed Frame */}
            <div className="w-full aspect-video rounded-3xl overflow-hidden border border-slate-100 dark:border-emerald-800/30 shadow-lg relative">
              <iframe
                title="Aman Indra Classes Location Map"
                src={settings.googleMapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d223.2685117185874!2d80.28700527479934!3d26.44618000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c47bda36740ef%3A0xdb53971ab28c86a!2sAman%20Indra%20Classes%20-%20Best%20PCM%20Coaching%20in%20Ratan%20Lal%20Nagar!5e0!3m2!1sen!2sin!4v1780909702425!5m2!1sen!2sin'}
                className="w-full h-full border-none"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>

          {/* Lead Enquiry Form Right */}
          <div className="lg:col-span-7">
            <LeadForm />
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
