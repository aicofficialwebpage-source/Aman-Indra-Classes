import React from 'react';
import { ClipboardList, BookOpen, Layers, LineChart, Sparkles, Trophy, ArrowRight } from 'lucide-react';

interface JourneyStep {
  title: string;
  desc: string;
  icon: React.ReactNode;
  stepNum: string;
}

export const SuccessJourney: React.FC = () => {
  const steps: JourneyStep[] = [
    {
      title: 'Assessment',
      desc: 'Initial evaluation of student strengths and conceptual gaps to tailor focus batches.',
      icon: <ClipboardList size={22} />,
      stepNum: '01'
    },
    {
      title: 'Concept Building',
      desc: 'Deep theoretical study and practical problem discussions guided by Kanpur’s top experts.',
      icon: <BookOpen size={22} />,
      stepNum: '02'
    },
    {
      title: 'Regular Testing',
      desc: 'Weekly topic tests and full-syllabus mock tests to hone speed, timing, and exam temperament.',
      icon: <Layers size={22} />,
      stepNum: '03'
    },
    {
      title: 'Performance Analysis',
      desc: 'Detailed scorecard audits checking error patterns and speed indexes to refine exam strategy.',
      icon: <LineChart size={22} />,
      stepNum: '04'
    },
    {
      title: 'Mentorship',
      desc: 'One-on-one progress review sessions with Aman Sir to restore confidence and clear blocks.',
      icon: <Sparkles size={22} />,
      stepNum: '05'
    },
    {
      title: 'Success',
      desc: 'Cracking JEE/NEET exams and scoring outstanding percentages in school board exams!',
      icon: <Trophy size={22} />,
      stepNum: '06'
    }
  ];

  return (
    <div className="relative">

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 relative z-10">
        {steps.map((step, idx) => (
          <div 
            key={idx}
            className="bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 p-8 rounded-3xl flex flex-col items-start text-left hover:border-slate-200 dark:hover:border-emerald-700/50 hover:shadow-xl transition-all duration-300 group relative"
          >
            {/* Step Number Badge */}
            <div className="absolute -top-3.5 right-6 bg-slate-50 dark:bg-emerald-950 border border-slate-100 dark:border-emerald-800/30 text-brand-dark dark:text-slate-300 font-extrabold text-[10px] uppercase tracking-wider py-1 px-3.5 rounded-full select-none shadow-sm group-hover:bg-brand-accent group-hover:text-brand-dark group-hover:border-brand-accent transition-colors">
              Step {step.stepNum}
            </div>

            {/* Icon Container */}
            <div className="w-12 h-12 bg-slate-50 dark:bg-emerald-950 border border-slate-100/60 dark:border-emerald-800/30 text-brand-dark dark:text-white group-hover:text-brand-accent rounded-2xl flex items-center justify-center mb-6 transition-colors shadow-inner shrink-0 mt-2">
              {step.icon}
            </div>

            {/* Step Details */}
            <h4 className="font-extrabold text-brand-dark dark:text-white text-base mb-2 group-hover:text-brand-accent transition-colors tracking-tight">
              {step.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {step.desc}
            </p>

            {/* Desktop Right Arrow */}
            {idx !== 2 && idx !== 5 && (
              <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-12 h-12 bg-brand-accent text-brand-dark rounded-full border-4 border-slate-50 dark:border-brand-dark flex items-center justify-center shadow-lg hidden lg:flex z-20 group-hover:scale-110 transition-transform duration-300 cursor-default">
                <ArrowRight size={20} strokeWidth={3} className="text-brand-dark" />
              </div>
            )}

            {/* Tablet Right Arrow (Z-pattern horizontal) */}
            {idx % 2 === 0 && (
              <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-12 h-12 bg-brand-accent text-brand-dark rounded-full border-4 border-slate-50 dark:border-brand-dark flex items-center justify-center shadow-lg hidden md:flex lg:hidden z-20 group-hover:scale-110 transition-transform duration-300 cursor-default">
                <ArrowRight size={20} strokeWidth={3} className="text-brand-dark" />
              </div>
            )}

            {/* Tablet Down Arrow (Z-pattern vertical transition) */}
            {(idx === 1 || idx === 3) && (
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-12 h-12 bg-brand-accent text-brand-dark rounded-full border-4 border-slate-50 dark:border-brand-dark flex items-center justify-center shadow-lg hidden md:flex lg:hidden z-20 group-hover:scale-110 transition-transform duration-300 cursor-default">
                <ArrowRight size={20} strokeWidth={3} className="text-brand-dark rotate-90" />
              </div>
            )}

            {/* Mobile Down Arrow */}
            {idx !== 5 && (
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-12 h-12 bg-brand-accent text-brand-dark rounded-full border-4 border-slate-50 dark:border-brand-dark flex items-center justify-center shadow-lg md:hidden z-20 group-hover:scale-110 transition-transform duration-300 cursor-default">
                <ArrowRight size={20} strokeWidth={3} className="text-brand-dark rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessJourney;
