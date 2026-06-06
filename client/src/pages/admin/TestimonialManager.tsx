import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MessageSquare, Star, Upload } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

interface Testimonial {
  _id: string;
  name: string;
  review: string;
  rating: number;
  photo?: string;
  type: 'Text' | 'Video';
  videoUrl?: string;
  status: 'Draft' | 'Published';
}

export const TestimonialManager: React.FC = () => {
  const { addToast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Inputs
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [type, setType] = useState<'Text' | 'Video'>('Text');
  const [videoUrl, setVideoUrl] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Published'>('Published');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [existingPhoto, setExistingPhoto] = useState('');

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await api.get('/testimonials/all');
      setTestimonials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenAdd = () => {
    setName('');
    setReview('');
    setRating(5);
    setType('Text');
    setVideoUrl('');
    setStatus('Published');
    setPhotoFile(null);
    setExistingPhoto('');
    setEditingId(null);
    setFormMode('add');
  };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingId(t._id);
    setName(t.name);
    setReview(t.review);
    setRating(t.rating);
    setType(t.type);
    setVideoUrl(t.videoUrl || '');
    setStatus(t.status);
    setPhotoFile(null);
    setExistingPhoto(t.photo || '');
    setFormMode('edit');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !review) {
      addToast('Validation Error', 'Name and Review text are mandatory fields.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('review', review);
    formData.append('rating', rating.toString());
    formData.append('type', type);
    formData.append('videoUrl', videoUrl);
    formData.append('status', status);
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    try {
      if (formMode === 'add') {
        await api.post('/testimonials', formData, true);
        addToast('Testimonial Added', `Successfully added parent/student appreciation review from ${name}.`, 'success');
      } else {
        await api.put(`/testimonials/${editingId}`, formData, true);
        addToast('Testimonial Updated', `Successfully edited appreciation review from ${name}.`, 'success');
      }
      setFormMode('list');
      fetchTestimonials();
    } catch (err: any) {
      addToast('Error saving testimonial', err.message || 'Failed to save testimonial.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      addToast('Testimonial Deleted', 'Successfully deleted appreciation review.', 'success');
      fetchTestimonials();
    } catch (err: any) {
      addToast('Delete Failed', err.message || 'Failed to delete testimonial.', 'error');
    }
  };

  const getImageUrl = (photoUrl?: string) => {
    if (!photoUrl) return '';
    if (photoUrl.startsWith('http')) return photoUrl;
    const serverOrigin = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    return `${serverOrigin}${photoUrl}`;
  };

  return (
    <div className="flex flex-col gap-6 text-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-extrabold text-brand-dark text-lg flex items-center gap-2">
          <MessageSquare className="text-brand-accent" size={20} />
          Student & Parent Testimonials Manager
        </h3>
        {formMode === 'list' && (
          <button
            onClick={handleOpenAdd}
            className="bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-bold py-2.5 px-5 rounded-full flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus size={15} />
            Add Review
          </button>
        )}
      </div>

      {formMode === 'list' ? (
        loading ? (
          <div className="bg-white border p-10 text-center rounded-2xl animate-pulse">
            <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="bg-white border rounded-2xl p-12 text-center text-slate-500">
            No testimonials records. Click "Add Review" to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t._id} className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-bold py-0.5 px-2.5 rounded-md ${
                      t.status === 'Published' ? 'bg-green-50 text-green-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {t.status}
                    </span>
                    <span className="bg-slate-50 border px-2 py-0.5 rounded text-[10px] text-slate-500 font-bold uppercase">
                      {t.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 mb-2">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>

                  <p className="text-slate-600 italic leading-relaxed line-clamp-4">"{t.review}"</p>
                  
                  <div className="flex items-center gap-3 mt-4">
                    {t.photo && (
                      <img 
                        src={getImageUrl(t.photo)} 
                        alt={t.name} 
                        className="w-8 h-8 object-cover rounded-full border border-slate-100 shrink-0" 
                      />
                    )}
                    <span className="font-extrabold text-brand-dark">{t.name}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-end gap-2">
                  <button onClick={() => handleOpenEdit(t)} className="p-2 border rounded-xl text-slate-500 hover:bg-slate-200 cursor-pointer">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(t._id)} className="p-2 border border-red-100 text-red-500 hover:bg-red-50 cursor-pointer">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm text-xs flex flex-col gap-4 max-w-2xl">
          <h4 className="font-bold text-brand-dark text-base">
            {formMode === 'add' ? 'Create Testimonial' : 'Edit Testimonial Details'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Student/Parent Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sanjeev Dixit (Parent of Aarav)"
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Rating (1 to 5 Stars)</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl bg-white focus:border-brand-accent text-xs"
              >
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★</option>
                <option value={3}>3 Stars ★★★</option>
                <option value={2}>2 Stars ★★</option>
                <option value={1}>1 Star ★</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Testimonial Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl bg-white focus:border-brand-accent text-xs"
              >
                <option value="Text">Written Review Text</option>
                <option value="Video">Video Link</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Publish Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl bg-white focus:border-brand-accent text-xs"
              >
                <option value="Published">Published (Public)</option>
                <option value="Draft">Draft (Invisible)</option>
              </select>
            </div>
          </div>

          {type === 'Video' && (
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Video Embed Link / URL</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-600">Review Comment Text *</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              placeholder="Enter review remarks details..."
              className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl resize-none focus:border-brand-accent text-xs"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-bold text-slate-600">Author Photo</span>
            <div className="flex items-center gap-4">
              <label className="border border-dashed py-3 px-5 rounded-xl cursor-pointer flex items-center gap-1.5 font-bold transition-all hover:bg-slate-50 text-slate-600">
                <Upload size={14} />
                Select Photo
                <input type="file" accept="image/*" onChange={(e) => e.target.files && setPhotoFile(e.target.files[0])} className="hidden" />
              </label>
              <div className="text-slate-400 text-[10px]">
                {photoFile ? <span className="text-green-600 font-bold">Selected: {photoFile.name}</span> : <span>PNG, JPG allowed.</span>}
              </div>
            </div>
            {existingPhoto && !photoFile && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Current Photo:</span>
                <img src={getImageUrl(existingPhoto)} alt="Existing review photo" className="w-8 h-8 object-cover rounded-full border" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 border-t pt-5 mt-3">
            <button type="submit" className="bg-brand-dark hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl cursor-pointer">
              Save Testimonial
            </button>
            <button type="button" onClick={() => setFormMode('list')} className="border border-slate-200 text-slate-600 font-bold py-2.5 px-6 rounded-xl hover:bg-slate-50 cursor-pointer">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TestimonialManager;
