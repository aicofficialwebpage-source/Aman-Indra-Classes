import React, { useState, useEffect } from 'react';
import { Bell, Calendar, ChevronRight, Volume2, ShieldAlert } from 'lucide-react';
import api from '../utils/api';

interface Notice {
  _id: string;
  title: string;
  content?: string;
  type: 'Admissions Open' | 'Scholarship Tests' | 'New Batch Launch' | 'Exam Schedule' | 'Parent Meetings';
  scheduleDate: string;
}

export const NoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await api.get('/notices');
        setNotices(data);
      } catch (err) {
        console.warn('Error loading notices from database:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const getTypeBadgeStyles = (type: string) => {
    switch (type) {
      case 'Admissions Open':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900/30';
      case 'Scholarship Tests':
        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-900/30';
      case 'New Batch Launch':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/30';
      case 'Exam Schedule':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800/30';
      case 'Parent Meetings':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/30';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-800/30';
    }
  };

  return (
    <div id="notices" className="bg-slate-50 dark:bg-emerald-900/10 rounded-3xl border border-slate-100 dark:border-emerald-900/20 p-6 md:p-8">
      {/* Header Ticker */}
      <div className="flex items-center gap-3 bg-brand-dark dark:bg-emerald-950 text-white py-2.5 px-4 rounded-2xl mb-6 shadow-sm overflow-hidden relative border dark:border-emerald-900/30">
        <Volume2 size={16} className="text-brand-accent animate-pulse shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider text-brand-accent shrink-0">Live Bulletins:</span>
        <div className="w-full relative overflow-hidden h-5">
          <div className="absolute flex whitespace-nowrap gap-8 text-xs font-medium animate-marquee">
            {notices.length > 0 ? (
              notices.map((n, idx) => (
                <span key={n._id || idx} className="hover:text-brand-accent transition-colors">
                  🔥 [{n.type}] {n.title}
                </span>
              ))
            ) : (
              <span>⚡ Admissions open for session 2026-27 | Contact us today to secure your seat! ⚡</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-brand-accent" />
          <h3 className="font-extrabold text-xl text-brand-dark dark:text-white">Latest Announcements</h3>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-muted dark:text-slate-400 bg-white dark:bg-emerald-900/25 border border-slate-200 dark:border-emerald-900/30 px-3 py-1 rounded-full">
          Realtime
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3 py-6 animate-pulse">
          <div className="h-20 bg-slate-200 dark:bg-emerald-900/20 rounded-2xl w-full" />
          <div className="h-20 bg-slate-200 dark:bg-emerald-900/20 rounded-2xl w-full" />
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-10 flex flex-col items-center justify-center gap-3 bg-white dark:bg-emerald-900/20 rounded-2xl border border-slate-200/60 dark:border-emerald-900/30 p-6">
          <ShieldAlert size={36} className="text-slate-300 dark:text-slate-500" />
          <h4 className="font-bold text-sm text-brand-dark dark:text-white">No Active Bulletins</h4>
          <p className="text-xs text-brand-muted dark:text-slate-300 max-w-xs">
            All coaching schedules are running normally. New announcements will be posted here as soon as they launch.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-2">
          {notices.map((notice) => (
            <div 
              key={notice._id} 
              className="bg-white dark:bg-emerald-900/20 border border-slate-100 dark:border-emerald-900/10 p-5 rounded-2xl hover:border-slate-200 dark:hover:border-brand-accent/35 hover:shadow-md hover:shadow-slate-100/40 dark:hover:shadow-none transition-all duration-300 group flex flex-col sm:flex-row sm:items-start gap-4"
            >
              {/* Date Column */}
              <div className="flex sm:flex-col items-center gap-1.5 shrink-0 bg-slate-50 dark:bg-emerald-950 border border-slate-100 dark:border-emerald-900/30 px-3.5 py-2.5 rounded-xl text-center min-w-[70px]">
                <Calendar size={14} className="text-slate-400 dark:text-slate-500" />
                <span className="font-extrabold text-brand-dark dark:text-white text-sm sm:text-base leading-none">
                  {new Date(notice.scheduleDate).getDate()}
                </span>
                <span className="font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wide">
                  {new Date(notice.scheduleDate).toLocaleString('en-US', { month: 'short' })}
                </span>
              </div>

              {/* Title & Info */}
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getTypeBadgeStyles(notice.type)}`}>
                    {notice.type}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm md:text-base text-brand-dark dark:text-white group-hover:text-brand-accent transition-colors leading-snug">
                  {notice.title}
                </h4>
                {notice.content && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                    {notice.content}
                  </p>
                )}
              </div>

              <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-accent group-hover:translate-x-0.5 transition-all self-center hidden sm:block shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
