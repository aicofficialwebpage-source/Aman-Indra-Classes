import React from 'react';
import { Trophy, BookOpen, Star, School } from 'lucide-react';

export interface Achiever {
  _id?: string;
  name: string;
  photo?: string;
  school?: string;
  marks?: string;
  rank?: string;
  achievement: string;
  category: 'JEE' | 'NEET' | 'Boards' | 'Foundation';
  year?: string;
}

interface TopperCardProps {
  achiever: Achiever;
}

export const TopperCard: React.FC<TopperCardProps> = ({ achiever }) => {
  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case 'JEE':
        return 'bg-black text-amber-400 border-black';
      case 'NEET':
        return 'bg-black text-orange-500 border-black';
      case 'Boards':
        return 'bg-black text-amber-400 border-black';
      default: // Foundation
        return 'bg-black text-orange-500 border-black';
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getImageUrl = (photoUrl?: string) => {
    if (!photoUrl) return '';
    if (photoUrl.startsWith('http')) return photoUrl;
    // Local upload fallback: prepend server origin
    const serverOrigin = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    return `${serverOrigin}${photoUrl}`;
  };

  const cleanPhoto = getImageUrl(achiever.photo);

  return (
    <div className="bg-white dark:bg-emerald-900/30 border border-slate-100 dark:border-emerald-900/20 p-5 rounded-3xl hover:border-slate-200 dark:hover:border-brand-accent/35 hover:shadow-xl dark:hover:shadow-none hover:shadow-slate-100/60 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
      
      {/* Target Badge */}
      <div className="absolute top-4 left-4 z-10 flex gap-1.5">
        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getCategoryStyles(achiever.category)}`}>
          {achiever.category}
        </span>
        {achiever.year && (
          <span className={`text-[10px] font-extrabold bg-black border border-black px-2.5 py-0.5 rounded-full ${
            achiever.category === 'JEE' || achiever.category === 'Boards' ? 'text-amber-400' : 'text-orange-500'
          }`}>
            {achiever.year}
          </span>
        )}
      </div>

      {/* Star Ornament */}
      <div className="absolute top-4 right-4 text-brand-accent/30 group-hover:text-brand-accent group-hover:rotate-12 transition-all duration-300">
        <Star size={16} fill="currentColor" />
      </div>

      {/* Picture Area */}
      <div className="w-full h-48 bg-slate-50 dark:bg-emerald-950 rounded-2xl overflow-hidden mb-5 relative flex items-center justify-center border border-slate-100 dark:border-emerald-900/30 shadow-inner shrink-0">
        {cleanPhoto ? (
          <img
            src={cleanPhoto}
            alt={achiever.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-16 h-16 bg-slate-200 dark:bg-emerald-900 text-slate-500 dark:text-slate-400 rounded-full flex items-center justify-center font-bold text-xl select-none">
            {getInitials(achiever.name)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Details Area */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-extrabold text-brand-dark dark:text-white text-base md:text-lg mb-1 leading-snug tracking-tight">
            {achiever.name}
          </h4>
          
          {achiever.school && (
            <div className="flex items-center gap-1.5 text-xs text-brand-muted dark:text-slate-400 mb-3 font-medium">
              <School size={13} className="shrink-0 text-slate-400 dark:text-slate-500" />
              <span className="truncate" title={achiever.school}>{achiever.school}</span>
            </div>
          )}
        </div>

        {/* Results Banner Box */}
        <div className="bg-slate-50/80 dark:bg-emerald-950/60 border border-slate-100/50 dark:border-emerald-900/20 p-3.5 rounded-2xl flex flex-col gap-1.5 justify-center">
          <div className="flex items-center gap-1.5 text-brand-dark dark:text-white">
            <Trophy size={14} className="text-brand-accent shrink-0" />
            <span className="font-extrabold text-sm tracking-tight text-gradient">{achiever.achievement}</span>
          </div>
          {(achiever.marks || achiever.rank) && (
            <div className="flex items-center gap-3 border-t border-slate-200/50 dark:border-emerald-900/30 pt-1.5 mt-0.5 text-xs font-bold text-slate-600 dark:text-slate-400">
              {achiever.marks && (
                <div className="flex items-center gap-1">
                  <BookOpen size={12} className="text-slate-400 dark:text-slate-500" />
                  <span>Score: {achiever.marks}</span>
                </div>
              )}
              {achiever.rank && (
                <div className="flex items-center gap-1 text-brand-accent">
                  <Star size={12} className="text-brand-accent shrink-0" />
                  <span>{achiever.rank}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopperCard;
