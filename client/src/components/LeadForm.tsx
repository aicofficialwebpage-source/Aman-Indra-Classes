import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { useLoading } from '../context/LoadingContext';

export const LeadForm: React.FC = () => {
  const { addToast } = useToast();
  const { showLoader, hideLoader } = useLoading();
  const [form, setForm] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    email: '',
    class: '',
    schoolName: '',
    course: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const triggerConfetti = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FACC15', '#042F1A']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FACC15', '#042F1A']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validations
    if (!form.studentName || !form.parentName || !form.phone || !form.class || !form.course) {
      setError('Please fill in all mandatory fields (*)');
      return;
    }

    const numericPhone = form.phone.replace(/[^0-9]/g, '');
    if (numericPhone.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    showLoader('Submitting your counseling inquiry...');

    try {
      await api.post('/leads', {
        ...form,
        type: 'Enquiry'
      });
      setSuccess(true);
      triggerConfetti();
      addToast(
        'Enquiry Received!', 
        `Thank you ${form.studentName}, we've sent a confirmation to your contact.`, 
        'success'
      );
      // Reset form
      setForm({
        studentName: '',
        parentName: '',
        phone: '',
        email: '',
        class: '',
        schoolName: '',
        course: '',
        message: ''
      });
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please check details and try again.');
      addToast(
        'Submission Failed', 
        err.message || 'Please review your inputs and try again.', 
        'error'
      );
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  if (success) {
    return (
      <div className="bg-slate-50 dark:bg-emerald-900/20 border border-slate-100 dark:border-emerald-900/30 p-8 rounded-3xl text-center flex flex-col items-center justify-center gap-4 animate-fade-in shadow-sm min-h-[400px]">
        <div className="w-16 h-16 bg-green-50 dark:bg-emerald-900 text-green-600 dark:text-brand-accent rounded-full flex items-center justify-center shadow-inner">
          <CheckCircle size={36} />
        </div>
        <h3 className="font-extrabold text-2xl text-brand-dark dark:text-white">Enquiry Received!</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm">
          Thank you for reaching out to Aman Indra Classes. Our counseling coordinator will call you within 24 hours to schedule your free guidance session.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-xs font-bold text-brand-accent underline hover:text-brand-accentHover cursor-pointer"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-emerald-900/30 border border-slate-100 dark:border-emerald-900/20 p-6 md:p-8 rounded-3xl shadow-xl dark:shadow-none shadow-slate-100/50 relative overflow-hidden">
      {/* Visual background accents */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-full blur-2xl pointer-events-none" />

      <h3 className="font-extrabold text-xl md:text-2xl text-brand-dark dark:text-white mb-1">
        Request Free Counseling
      </h3>
      <p className="text-xs text-brand-muted dark:text-slate-300 mb-6">
        Have questions? Fill out this form and book a personalized academic roadmap counselor call.
      </p>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-xl flex items-center gap-2 animate-shake">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="studentName" className="font-bold text-xs text-brand-dark dark:text-slate-200">Student Name *</label>
            <input
              id="studentName"
              type="text"
              name="studentName"
              placeholder="Enter Student Name"
              value={form.studentName}
              onChange={handleChange}
              disabled={loading}
              className="border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/80 text-brand-dark dark:text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="parentName" className="font-bold text-xs text-brand-dark dark:text-slate-200">Parent Name *</label>
            <input
              id="parentName"
              type="text"
              name="parentName"
              placeholder="Enter Parent/Guardian Name"
              value={form.parentName}
              onChange={handleChange}
              disabled={loading}
              className="border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/80 text-brand-dark dark:text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="font-bold text-xs text-brand-dark dark:text-slate-200">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="Enter 10-digit Mobile"
              value={form.phone}
              onChange={handleChange}
              disabled={loading}
              className="border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/80 text-brand-dark dark:text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-bold text-xs text-brand-dark dark:text-slate-200">Email Address (Optional)</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/80 text-brand-dark dark:text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="class" className="font-bold text-xs text-brand-dark dark:text-slate-200">Class / Target *</label>
            <select
              id="class"
              name="class"
              value={form.class}
              onChange={handleChange}
              disabled={loading}
              className="border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/80 text-brand-dark dark:text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl transition-all"
            >
              <option value="" className="text-brand-dark dark:text-white bg-white dark:bg-emerald-950">Select Class</option>
              <option value="Class 6" className="text-brand-dark dark:text-white bg-white dark:bg-emerald-950">Class 6th</option>
              <option value="Class 7" className="text-brand-dark dark:text-white bg-white dark:bg-emerald-950">Class 7th</option>
              <option value="Class 8" className="text-brand-dark dark:text-white bg-white dark:bg-emerald-950">Class 8th</option>
              <option value="Class 9" className="text-brand-dark dark:text-white bg-white dark:bg-emerald-950">Class 9th</option>
              <option value="Class 10" className="text-brand-dark dark:text-white bg-white dark:bg-emerald-950">Class 10th</option>
              <option value="Class 11" className="text-brand-dark dark:text-white bg-white dark:bg-emerald-950">Class 11th</option>
              <option value="Class 12" className="text-brand-dark dark:text-white bg-white dark:bg-emerald-950">Class 12th</option>
              <option value="Dropper / Ex-Student" className="text-brand-dark dark:text-white bg-white dark:bg-emerald-950">Dropper / Target JEE-NEET</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="course" className="font-bold text-xs text-brand-dark dark:text-slate-200">Program Interested In *</label>
            <select
              id="course"
              name="course"
              value={form.course}
              onChange={handleChange}
              disabled={loading}
              className="border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/80 text-brand-dark dark:text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl transition-all"
            >
              <option value="" className="text-brand-dark dark:text-white bg-white dark:bg-emerald-950">Select Program</option>
              <option value="Foundation Program (Class 6-8)" className="text-brand-dark dark:text-white bg-white dark:bg-emerald-950">Foundation (Class 6-8)</option>
              <option value="Academic Excellence (Class 9-10)" className="text-brand-dark dark:text-white bg-white dark:bg-emerald-950">Academic Excellence (Class 9-10)</option>
              <option value="Board Prep (Class 11-12)" className="text-brand-dark dark:text-white bg-white dark:bg-emerald-950">Boards Preparation (Class 11-12)</option>
              <option value="IIT-JEE Preparation" className="text-brand-dark dark:text-white bg-white dark:bg-emerald-950">IIT-JEE Prep Target</option>
              <option value="NEET Preparation" className="text-brand-dark dark:text-white bg-white dark:bg-emerald-950">NEET Prep Target</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="schoolName" className="font-bold text-xs text-brand-dark dark:text-slate-200">Current School Name (Optional)</label>
          <input
            id="schoolName"
            type="text"
            name="schoolName"
            placeholder="e.g. DPS, Methodist, Singhania etc."
            value={form.schoolName}
            onChange={handleChange}
            disabled={loading}
            className="border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/80 text-brand-dark dark:text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="font-bold text-xs text-brand-dark dark:text-slate-200">Additional Message (Optional)</label>
          <textarea
            id="message"
            name="message"
            rows={3}
            placeholder="Enter query details, batch timing choices, subjects needed etc."
            value={form.message}
            onChange={handleChange}
            disabled={loading}
            className="border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/80 text-brand-dark dark:text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl resize-none transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-3 bg-brand-accent hover:bg-brand-accentHover text-brand-dark font-extrabold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-yellow-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Submitting Enquiry...
            </>
          ) : (
            <>
              <Send size={18} />
              Submit Details
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default LeadForm;
