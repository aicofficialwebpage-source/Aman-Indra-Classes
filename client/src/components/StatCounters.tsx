import React, { useState, useEffect, useRef } from 'react';
import { Users, Calendar, Award, BookOpen } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  targetNumber: number;
  suffix: string;
}

const StatCard: React.FC<StatItemProps> = ({ icon, label, targetNumber, suffix }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const duration = 1500; // 1.5 seconds animation
    const steps = 60;
    const increment = targetNumber / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetNumber) {
        setCount(targetNumber);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasStarted, targetNumber]);

  return (
    <div 
      ref={elementRef}
      className="bg-white dark:bg-emerald-900/35 border border-slate-100 dark:border-emerald-900/20 p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-xl dark:shadow-none shadow-slate-100/40 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group"
    >
      <div className="w-14 h-14 bg-slate-50 dark:bg-emerald-950 text-brand-accent rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-brand-accent group-hover:text-brand-dark transition-all duration-300 shadow-inner dark:border dark:border-emerald-900/10">
        {icon}
      </div>
      <div className="font-extrabold text-3xl md:text-4xl text-brand-dark dark:text-white tracking-tight mb-2">
        {count}
        <span className="text-brand-accent">{suffix}</span>
      </div>
      <div className="font-semibold text-slate-500 dark:text-slate-400 text-xs md:text-sm tracking-wide uppercase">
        {label}
      </div>
    </div>
  );
};

export const StatCounters: React.FC = () => {
  return (
    <section className="bg-slate-50/50 dark:bg-emerald-950/20 border-y border-slate-100 dark:border-emerald-900/20 py-16 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          icon={<Users size={24} />}
          label="Students Mentored"
          targetNumber={1000}
          suffix="+"
        />
        <StatCard
          icon={<Calendar size={24} />}
          label="Years of Excellence"
          targetNumber={10}
          suffix="+"
        />
        <StatCard
          icon={<Award size={24} />}
          label="Multiple School Toppers"
          targetNumber={75}
          suffix="+"
        />
        <StatCard
          icon={<BookOpen size={24} />}
          label="IIT-JEE & NEET Focus"
          targetNumber={100}
          suffix="%"
        />
      </div>
    </section>
  );
};

export default StatCounters;
