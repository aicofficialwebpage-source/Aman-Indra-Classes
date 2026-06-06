import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import api from '../utils/api';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  author: string;
  createdAt: string;
}

export const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set tab title
    document.title = 'Preparation Blogs & Strategies - Aman Indra Classes';
    
    const fetchBlogs = async () => {
      try {
        const data = await api.get('/blogs');
        setBlogs(data);
      } catch (err) {
        console.warn('Could not retrieve blog articles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const getImageUrl = (photoUrl?: string) => {
    if (!photoUrl) return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800';
    if (photoUrl.startsWith('http')) return photoUrl;
    const serverOrigin = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    return `${serverOrigin}${photoUrl}`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-emerald-950 py-16 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block bg-brand-dark/5 dark:bg-brand-accent/15 border border-brand-dark/10 dark:border-brand-accent/30 text-brand-dark dark:text-brand-accent text-[10px] font-extrabold uppercase tracking-widest py-1 px-4.5 rounded-full mb-3">
            Academic Insights
          </span>
          <h1 className="font-extrabold text-3xl md:text-4xl text-brand-dark dark:text-white tracking-tight mb-4">
            Prep Strategies & Board Guidelines
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Stay updated with conceptual hacks, revision schedules, exam strategies, and syllabus guidance prepared directly by our senior coaching instructors.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-slate-100 dark:bg-emerald-900/10 h-96 rounded-3xl" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-emerald-900/20 border border-slate-100 dark:border-emerald-900/30 rounded-3xl p-8 max-w-md mx-auto shadow-sm flex flex-col items-center gap-3">
            <BookOpen size={40} className="text-slate-300 dark:text-slate-500" />
            <h3 className="font-bold text-lg text-brand-dark dark:text-white">No Articles Published</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Our teachers are preparing updates! Tips on JEE Math formulas and Board Prep guides will appear here shortly.
            </p>
            <Link 
              to="/"
              className="mt-2 btn-primary text-xs py-2 px-6"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          /* Grid list */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article 
                key={blog._id}
                className="bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 rounded-3xl overflow-hidden hover:shadow-xl hover:border-slate-200 dark:hover:border-emerald-700/50 transition-all duration-300 flex flex-col h-full group"
              >
                {/* Feature image */}
                <Link to={`/blogs/${blog.slug}`} className="block h-48 bg-slate-100 dark:bg-emerald-950 overflow-hidden relative border-b border-slate-50 dark:border-emerald-900/10 shrink-0">
                  <img
                    src={getImageUrl(blog.featuredImage)}
                    alt={blog.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
                </Link>

                {/* Article Info */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="flex flex-col gap-3">
                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        <span>{new Date(blog.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={12} className="text-slate-400" />
                        <span>{blog.author}</span>
                      </div>
                    </div>

                    <Link to={`/blogs/${blog.slug}`}>
                      <h2 className="font-extrabold text-brand-dark dark:text-white text-lg group-hover:text-brand-accent transition-colors leading-snug tracking-tight">
                        {blog.title}
                      </h2>
                    </Link>

                    {blog.excerpt && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {blog.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 border-t border-slate-100 dark:border-emerald-800/30 pt-4 flex items-center justify-between">
                    <Link 
                      to={`/blogs/${blog.slug}`}
                      className="text-xs font-bold text-brand-dark dark:text-white group-hover:text-brand-accent transition-colors flex items-center gap-1 hover:underline"
                    >
                      Read Strategy
                      <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogList;
