import React, { useState, useEffect } from 'react';
import { Star, Play, X, ChevronLeft, ChevronRight, User } from 'lucide-react';
import api from '../utils/api';

interface Testimonial {
  _id: string;
  name: string;
  review: string;
  rating: number;
  photo?: string;
  type: 'Text' | 'Video';
  videoUrl?: string;
}

export const TestimonialCarousel: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await api.get('/testimonials');
        setTestimonials(data);
      } catch (err) {
        console.warn('Error loading testimonials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handleNext = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    if (testimonials.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getImageUrl = (photoUrl?: string) => {
    if (!photoUrl) return '';
    if (photoUrl.startsWith('http')) return photoUrl;
    const serverOrigin = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    return `${serverOrigin}${photoUrl}`;
  };

  // Safe YouTube embed url converter
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    // youtube.com/watch?v=...
    if (url.includes('v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    // youtu.be/...
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4">
      {loading ? (
        <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8 text-center animate-pulse h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl text-center text-slate-500 font-medium">
          "The teachers here understand the speed of every student. Highly recommended." - Parents Review
        </div>
      ) : (
        <div className="relative">
          {/* Card View */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-12 shadow-xl shadow-slate-100/50 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            
            {/* Visual quotes mark background decoration */}
            <div className="absolute top-6 left-6 text-brand-accent/5 font-serif text-[180px] leading-none select-none pointer-events-none font-bold">
              “
            </div>

            {/* Left side: Avatar and video trigger */}
            <div className="w-24 h-24 md:w-36 md:h-36 shrink-0 rounded-2xl overflow-hidden relative bg-slate-100 flex items-center justify-center border border-slate-100 shadow-sm z-10">
              {testimonials[activeIndex].photo ? (
                <img
                  src={getImageUrl(testimonials[activeIndex].photo)}
                  alt={testimonials[activeIndex].name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={48} className="text-slate-400" />
              )}

              {/* Play Button Overlay for Video Testimonials */}
              {testimonials[activeIndex].type === 'Video' && testimonials[activeIndex].videoUrl && (
                <button
                  onClick={() => setVideoModalUrl(getEmbedUrl(testimonials[activeIndex].videoUrl || ''))}
                  className="absolute inset-0 bg-brand-dark/40 hover:bg-brand-dark/50 flex items-center justify-center text-white transition-all group cursor-pointer"
                  title="Play Video Review"
                >
                  <div className="w-11 h-11 bg-brand-accent text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                    <Play size={18} fill="currentColor" className="ml-0.5" />
                  </div>
                </button>
              )}
            </div>

            {/* Right side: Review details */}
            <div className="flex-1 flex flex-col gap-4 text-center md:text-left z-10">
              {/* Stars */}
              <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
                {Array.from({ length: testimonials[activeIndex].rating }).map((_, idx) => (
                  <Star key={idx} size={16} fill="currentColor" />
                ))}
              </div>

              {/* Text */}
              <p className="text-slate-700 font-medium text-sm md:text-base leading-relaxed italic">
                "{testimonials[activeIndex].review}"
              </p>

              {/* Author Info */}
              <div className="mt-2">
                <h4 className="font-extrabold text-brand-dark text-base">
                  {testimonials[activeIndex].name}
                </h4>
                {testimonials[activeIndex].type === 'Video' && (
                  <button
                    onClick={() => setVideoModalUrl(getEmbedUrl(testimonials[activeIndex].videoUrl || ''))}
                    className="text-xs font-bold text-brand-accent hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <Play size={12} fill="currentColor" /> Play Video Testimonial
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              className="w-10 h-10 border border-slate-200 bg-white text-slate-700 hover:border-brand-dark hover:bg-brand-dark hover:text-white dark:text-brand-dark dark:hover:text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-300">
              {activeIndex + 1} / {testimonials.length}
            </span>
            <button
              onClick={handleNext}
              className="w-10 h-10 border border-slate-200 bg-white text-slate-700 hover:border-brand-dark hover:bg-brand-dark hover:text-white dark:text-brand-dark dark:hover:text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Video Modal Lightbox Overlay */}
      {videoModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setVideoModalUrl(null)} />
          <div className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl z-10 animate-scale-up">
            <button
              onClick={() => setVideoModalUrl(null)}
              className="absolute top-4 right-4 text-white hover:text-brand-accent bg-black/60 hover:bg-black p-2 rounded-full transition-colors z-20 cursor-pointer"
              aria-label="Close video player"
            >
              <X size={18} />
            </button>
            <iframe
              src={videoModalUrl}
              title="Student Review Video Player"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialCarousel;
