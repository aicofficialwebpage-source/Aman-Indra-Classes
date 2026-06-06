import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, BookOpen, Clock } from 'lucide-react';
import api from '../utils/api';

interface Blog {
  _id: string;
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  author: string;
  createdAt: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogDetails = async () => {
      if (!slug) return;
      
      try {
        const data = await api.get(`/blogs/${slug}`);
        setBlog(data);
        
        // Dynamically update SEO tags
        document.title = `${data.metaTitle || data.title} - Aman Indra Classes`;
        
        const metaDescEl = document.querySelector('meta[name="description"]');
        if (metaDescEl && data.metaDescription) {
          metaDescEl.setAttribute('content', data.metaDescription);
        }
      } catch (err) {
        console.warn('Failed to load blog article details:', err);
        navigate('/blogs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogDetails();
  }, [slug, navigate]);

  const getImageUrl = (photoUrl?: string) => {
    if (!photoUrl) return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200';
    if (photoUrl.startsWith('http')) return photoUrl;
    const serverOrigin = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    return `${serverOrigin}${photoUrl}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!blog) return null;

  // Simple reading time estimator (200 words per minute average)
  const getReadingTime = (text: string) => {
    const wordCount = text.split(/\s+/).length;
    const time = Math.ceil(wordCount / 200);
    return `${time} min read`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-emerald-950 py-12 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <Link 
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-brand-accent dark:hover:text-brand-accent mb-8 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Preparation Blogs
        </Link>

        {/* Article Container */}
        <article className="bg-white dark:bg-emerald-900/25 border border-slate-100 dark:border-emerald-800/30 rounded-3xl overflow-hidden shadow-xl p-6 md:p-10">
          
          {/* Header Metadata */}
          <header className="mb-8 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wide">
              <span className="bg-brand-accent/15 text-brand-accent py-0.5 px-3 rounded-full border border-brand-accent/20">
                Prep Strategy
              </span>
              <div className="flex items-center gap-1">
                <Calendar size={13} className="text-slate-400" />
                <span>{new Date(blog.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={13} className="text-slate-400" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={13} className="text-slate-400" />
                <span>{getReadingTime(blog.content)}</span>
              </div>
            </div>

            <h1 className="font-extrabold text-2xl md:text-3.5xl text-brand-dark dark:text-white leading-tight tracking-tight mt-2">
              {blog.title}
            </h1>
            
            {blog.excerpt && (
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-brand-accent pl-4 mt-2">
                {blog.excerpt}
              </p>
            )}
          </header>

          {/* Featured Image */}
          <div className="w-full h-64 md:h-96 bg-slate-100 dark:bg-emerald-950 rounded-2xl overflow-hidden mb-10 shadow-inner">
            <img
              src={getImageUrl(blog.featuredImage)}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* HTML Content Body */}
          <div 
            className="prose prose-slate max-w-none text-slate-700 dark:text-slate-200 leading-relaxed text-sm md:text-base flex flex-col gap-5
                       prose-headings:font-extrabold prose-headings:text-brand-dark dark:prose-headings:text-white prose-headings:mt-6 prose-headings:mb-2
                       prose-h2:text-xl prose-h2:md:text-2xl prose-h3:text-lg prose-h3:md:text-xl
                       prose-p:mb-4 prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                       prose-strong:font-bold prose-strong:text-brand-dark dark:prose-strong:text-brand-accent"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Keywords tags */}
          {blog.metaKeywords && (
            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-emerald-800/30 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-brand-dark dark:text-white uppercase tracking-wider mr-2">Tags:</span>
              {blog.metaKeywords.split(',').map((kw, idx) => (
                <span 
                  key={idx}
                  className="bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-900/30 text-[10px] font-bold text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg"
                >
                  {kw.trim()}
                </span>
              ))}
            </div>
          )}

        </article>

        {/* CTA section at bottom of article */}
        <div className="mt-8 bg-brand-dark text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg border dark:border-emerald-900/20">
          <div>
            <h4 className="font-extrabold text-lg mb-1 flex items-center gap-2 text-white">
              <BookOpen size={18} className="text-brand-accent animate-pulse" />
              Prepare for Admissions & Scholarship Test
            </h4>
            <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
              Join Kanpur's leading coaching classroom for Class 6th–12th boards, IIT-JEE and NEET prep. Open doors to expert personal mentorship today.
            </p>
          </div>
          <Link
            to="/"
            className="bg-brand-accent hover:bg-brand-accentHover text-brand-dark text-xs font-bold py-3 px-6 rounded-full shadow-md transition-colors shrink-0"
          >
            Apply for Counseling
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BlogDetail;
