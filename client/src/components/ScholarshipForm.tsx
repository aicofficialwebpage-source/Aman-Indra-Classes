import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2, Sparkles, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

interface ScholarshipFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScholarshipForm: React.FC<ScholarshipFormProps> = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    class: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FACC15', '#042F1A', '#F4F9F5']
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.studentName || !form.parentName || !form.phone || !form.class) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    const numericPhone = form.phone.replace(/[^0-9]/g, '');
    if (numericPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/leads', {
        ...form,
        course: `Scholarship Test - ${form.class}`,
        type: 'Scholarship',
        message: `Registered for AIST (Scholarship Test) for class: ${form.class}`
      });
      
      setSuccess(true);
      triggerConfetti();
      addToast(
        'AIST Registered!',
        `Registration complete for ${form.studentName}. Detailed schedule sent to your contacts.`,
        'success'
      );
      
      setForm({
        studentName: '',
        parentName: '',
        phone: '',
        class: '',
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try again.');
      addToast(
        'Registration Failed',
        err.message || 'Could not register for AIST. Try again later.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-emerald-950 rounded-3xl shadow-2xl overflow-hidden animate-scale-up border border-slate-100 dark:border-emerald-900/20 z-10">
        
        {/* Top styling band */}
        <div className="bg-gradient-to-r from-brand-dark to-emerald-900 text-white py-6 px-8 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 dark:text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="text-brand-accent animate-bounce" size={18} />
            <span className="text-[10px] tracking-wider uppercase font-bold text-brand-accent">Aman Indra Classes (Kanpur)</span>
          </div>
          <h3 className="font-extrabold text-lg md:text-xl text-white">
            AIST Scholarship Registration
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Register for AIST 2026 and unlock up to 100% scholarship fee waiver on classroom tuition.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-8">
          {success ? (
            <div className="text-center py-6 flex flex-col items-center justify-center gap-4">
              <div className="w-14 h-14 bg-green-50 dark:bg-emerald-900/40 text-green-600 dark:text-brand-accent rounded-full flex items-center justify-center">
                <CheckCircle size={30} />
              </div>
              <h4 className="font-extrabold text-xl text-brand-dark dark:text-white">Registration Successful!</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                Congratulations! Your registration for the **Aman Indra Scholarship Test (AIST)** has been received. Our team will SMS/call you with your Roll Number and Test Center guidelines.
              </p>
              <button 
                onClick={() => { setSuccess(false); onClose(); }}
                className="mt-4 bg-brand-dark dark:bg-brand-accent hover:bg-emerald-900 dark:hover:bg-brand-accentHover text-white dark:text-brand-dark py-2.5 px-6 rounded-full font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-brand-dark dark:text-slate-200" htmlFor="studName">Student Name *</label>
                <input
                  id="studName"
                  type="text"
                  name="studentName"
                  placeholder="Full name of student"
                  value={form.studentName}
                  onChange={handleChange}
                  disabled={loading}
                  className="border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/80 text-brand-dark dark:text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-xs text-brand-dark dark:text-slate-200" htmlFor="parName">Parent Name *</label>
                <input
                  id="parName"
                  type="text"
                  name="parentName"
                  placeholder="Parent/Guardian Name"
                  value={form.parentName}
                  onChange={handleChange}
                  disabled={loading}
                  className="border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/80 text-brand-dark dark:text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-brand-dark dark:text-slate-200" htmlFor="studClass">Class / Stream *</label>
                  <select
                    id="studClass"
                    name="class"
                    value={form.class}
                    onChange={handleChange}
                    disabled={loading}
                    className="border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/80 text-brand-dark dark:text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl transition-all"
                  >
                    <option value="" className="text-brand-dark bg-white dark:bg-emerald-950">Select Class</option>
                    <option value="Class 6" className="text-brand-dark bg-white dark:bg-emerald-950">Class 6th</option>
                    <option value="Class 7" className="text-brand-dark bg-white dark:bg-emerald-950">Class 7th</option>
                    <option value="Class 8" className="text-brand-dark bg-white dark:bg-emerald-950">Class 8th</option>
                    <option value="Class 9" className="text-brand-dark bg-white dark:bg-emerald-950">Class 9th</option>
                    <option value="Class 10" className="text-brand-dark bg-white dark:bg-emerald-950">Class 10th</option>
                    <option value="Class 11 (PCM)" className="text-brand-dark bg-white dark:bg-emerald-950">Class 11th (PCM)</option>
                    <option value="Class 11 (PCB)" className="text-brand-dark bg-white dark:bg-emerald-950">Class 11th (PCB)</option>
                    <option value="Class 12 (PCM)" className="text-brand-dark bg-white dark:bg-emerald-950">Class 12th (PCM)</option>
                    <option value="Class 12 (PCB)" className="text-brand-dark bg-white dark:bg-emerald-950">Class 12th (PCB)</option>
                    <option value="Dropper JEE" className="text-brand-dark bg-white dark:bg-emerald-950">JEE Target Batch</option>
                    <option value="Dropper NEET" className="text-brand-dark bg-white dark:bg-emerald-950">NEET Target Batch</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-xs text-brand-dark dark:text-slate-200" htmlFor="studPhone">Mobile Number *</label>
                  <input
                    id="studPhone"
                    type="tel"
                    name="phone"
                    placeholder="10-digit number"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={loading}
                    className="border border-slate-200 dark:border-emerald-800/40 bg-white dark:bg-emerald-950/80 text-brand-dark dark:text-white focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none py-2.5 px-4 rounded-xl transition-all"
                  />
                </div>
              </div>

              <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-455 flex items-start gap-1.5 bg-slate-50 dark:bg-emerald-900/20 p-3 rounded-xl leading-relaxed border dark:border-emerald-900/10">
                <BookOpen size={14} className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                <span className="dark:text-slate-300">
                  <strong className="text-brand-dark dark:text-white">AIST Test Format:</strong> The exam is offline and contains Multiple Choice Questions testing Mathematics, Science / Aptitude appropriate for your class level.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-brand-accent hover:bg-brand-accentHover text-brand-dark font-extrabold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-yellow-500/10 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Registering for AIST...
                  </>
                ) : (
                  'Register & Secure Slot'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipForm;
