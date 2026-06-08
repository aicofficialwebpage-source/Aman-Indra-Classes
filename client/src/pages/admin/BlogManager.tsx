import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Upload, Eye, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { useLoading } from '../../context/LoadingContext';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  author: string;
  createdAt: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export const BlogManager: React.FC = () => {
  const { addToast } = useToast();
  const { showLoader, hideLoader } = useLoading();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Inputs
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Aman Indra Classes');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [existingPhoto, setExistingPhoto] = useState('');

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await api.get('/blogs');
      setBlogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenAdd = () => {
    setTitle('');
    setExcerpt('');
    setContent('');
    setAuthor('Aman Indra Classes');
    setMetaTitle('');
    setMetaDescription('');
    setMetaKeywords('');
    setPhotoFile(null);
    setExistingPhoto('');
    setEditingId(null);
    setFormMode('add');
  };

  const handleOpenEdit = (b: Blog) => {
    setEditingId(b._id);
    setTitle(b.title);
    setExcerpt(b.excerpt || '');
    setContent(b.content);
    setAuthor(b.author || 'Aman Indra Classes');
    setMetaTitle(b.metaTitle || '');
    setMetaDescription(b.metaDescription || '');
    setMetaKeywords(b.metaKeywords || '');
    setPhotoFile(null);
    setExistingPhoto(b.featuredImage || '');
    setFormMode('edit');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      addToast('Validation Error', 'Please provide Title and Content.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('excerpt', excerpt);
    formData.append('content', content);
    formData.append('author', author);
    formData.append('metaTitle', metaTitle || title);
    formData.append('metaDescription', metaDescription || excerpt);
    formData.append('metaKeywords', metaKeywords);
    if (photoFile) {
      formData.append('featuredImage', photoFile);
    }

    setIsSaving(true);
    showLoader(formMode === 'add' ? 'Publishing strategy post...' : 'Updating strategy post changes...');
    try {
      if (formMode === 'add') {
        await api.post('/blogs', formData, true);
        addToast('Blog Published', `Successfully published blog post: "${title}".`, 'success');
      } else {
        await api.put(`/blogs/${editingId}`, formData, true);
        addToast('Blog Updated', `Successfully updated blog post: "${title}".`, 'success');
      }
      setFormMode('list');
      fetchBlogs();
    } catch (err: any) {
      addToast('Error saving blog', err.message || 'Failed to save blog post.', 'error');
    } finally {
      setIsSaving(false);
      hideLoader();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    setDeletingId(id);
    showLoader('Deleting blog post...');
    try {
      await api.delete(`/blogs/${id}`);
      addToast('Blog Deleted', 'Successfully deleted blog post.', 'success');
      fetchBlogs();
    } catch (err: any) {
      addToast('Delete Failed', err.message || 'Failed to delete blog post.', 'error');
    } finally {
      setDeletingId(null);
      hideLoader();
    }
  };

  const getImageUrl = (photoUrl?: string) => {
    if (!photoUrl) return '';
    if (photoUrl.startsWith('http')) return photoUrl;
    const serverOrigin = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    return `${serverOrigin}${photoUrl}`;
  };

  return (
    <div className="flex flex-col gap-6 text-xs animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-extrabold text-brand-dark text-lg flex items-center gap-2">
          <BookOpen className="text-brand-accent" size={20} />
          Prep Blogs & Articles Management
        </h3>
        {formMode === 'list' && (
          <button
            onClick={handleOpenAdd}
            className="bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-bold py-2.5 px-5 rounded-full flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus size={15} />
            Create Post
          </button>
        )}
      </div>

      {formMode === 'list' ? (
        loading ? (
          <div className="bg-white border p-10 text-center rounded-2xl animate-pulse">
            <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white border rounded-2xl p-12 text-center text-slate-500">
            No blogs records. Click "Create Post" to compose an article.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {blogs.map((b) => (
              <div 
                key={b._id} 
                className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition-all"
              >
                {b.featuredImage && (
                  <img 
                    src={getImageUrl(b.featuredImage)} 
                    alt={b.title} 
                    className="w-20 h-14 object-cover rounded-lg border shrink-0" 
                  />
                )}
                
                <div className="flex-1">
                  <h4 className="font-extrabold text-brand-dark text-sm leading-snug">{b.title}</h4>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    By {b.author} | URL: /blogs/{b.slug}
                  </span>
                  {b.excerpt && <p className="text-slate-500 line-clamp-2 mt-1 leading-relaxed">{b.excerpt}</p>}
                </div>

                <div className="flex items-center gap-2 mt-3 sm:mt-0 border-t sm:border-t-0 pt-3 sm:pt-0 shrink-0 self-end sm:self-center">
                  <a 
                    href={`/blogs/${b.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl flex items-center justify-center cursor-pointer"
                    title="Preview Live"
                  >
                    <Eye size={13} />
                  </a>
                  <button 
                    onClick={() => handleOpenEdit(b)} 
                    className="p-2 border border-slate-200 text-slate-2005 hover:bg-slate-50 rounded-xl flex items-center justify-center cursor-pointer"
                    title="Edit content"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button 
                    onClick={() => handleDelete(b._id)} 
                    disabled={deletingId !== null}
                    className="p-2 border border-red-100 text-red-500 hover:bg-red-50 rounded-xl flex items-center justify-center cursor-pointer disabled:opacity-50"
                    title="Delete post"
                  >
                    {deletingId === b._id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm text-xs flex flex-col gap-4 max-w-3xl">
          <h4 className="font-bold text-brand-dark text-base border-b pb-2">
            {formMode === 'add' ? 'Compose Prep Strategy Post' : 'Modify Article Content'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Post Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How to crack NEET organic chemistry"
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Dr. Indrani Sen"
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-600">Excerpt Summary (Appears on listings pages)</label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short 2-line summary describing what this strategy discusses..."
              className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
            />
          </div>

          {/* HTML Rich body box */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-600">Article Body Content (Supports HTML formatting tags)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              placeholder="Use standard paragraphs, <h2>Heading 2</h2> for structural sections, and <ul><li>lists</li></ul> tags..."
              className="border border-slate-200 bg-white text-slate-800 outline-none py-2.5 px-3 rounded-xl font-mono resize-none focus:border-brand-accent text-xs leading-relaxed"
            />
          </div>

          {/* SEO Block */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col gap-3">
            <span className="font-bold text-slate-700 block">SEO Configurations</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-600">Meta Title Override</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Defaults to title if left blank"
                  className="border border-slate-200 bg-white text-slate-800 outline-none py-1.5 px-3 rounded-lg focus:border-brand-accent text-xs bg-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-600">Meta Keywords (Comma separated)</label>
                <input
                  type="text"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="NEET, Organic Chemistry, revision sheets"
                  className="border border-slate-200 bg-white text-slate-800 outline-none py-1.5 px-3 rounded-lg focus:border-brand-accent text-xs bg-white"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Meta Description tag</label>
              <input
                type="text"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Brief summary for search engine snippet..."
                className="border border-slate-200 bg-white text-slate-800 outline-none py-1.5 px-3 rounded-lg focus:border-brand-accent text-xs bg-white"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-slate-600">Featured Header Image</span>
            <div className="flex items-center gap-4">
              <label className="border border-dashed py-3 px-5 rounded-xl cursor-pointer flex items-center gap-1.5 font-bold transition-all hover:bg-slate-50 text-slate-600">
                <Upload size={14} />
                Select Image
                <input type="file" accept="image/*" onChange={(e) => e.target.files && setPhotoFile(e.target.files[0])} className="hidden" />
              </label>
              <div className="text-slate-400 text-[10px]">
                {photoFile ? <span className="text-green-600 font-bold">Selected: {photoFile.name}</span> : <span>PNG, JPG allowed.</span>}
              </div>
            </div>
            {existingPhoto && !photoFile && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Current Image:</span>
                <img src={getImageUrl(existingPhoto)} alt="Featured blog header" className="w-16 h-10 object-cover rounded-md border" />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 border-t pt-5 mt-3">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-brand-dark hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              Publish Strategy Post
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setFormMode('list')}
              className="border border-slate-200 text-slate-600 font-bold py-2.5 px-6 rounded-xl hover:bg-slate-50 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BlogManager;
