import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Trophy, Upload, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { useLoading } from '../../context/LoadingContext';

interface Achiever {
  _id: string;
  name: string;
  photo?: string;
  school?: string;
  marks?: string;
  rank?: string;
  achievement: string;
  category: 'JEE' | 'NEET' | 'Boards' | 'Foundation';
  year?: string;
}

export const AchieverManager: React.FC = () => {
  const { addToast } = useToast();
  const { showLoader, hideLoader } = useLoading();
  const [achievers, setAchievers] = useState<Achiever[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Form states
  const [formMode, setFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [marks, setMarks] = useState('');
  const [rank, setRank] = useState('');
  const [achievement, setAchievement] = useState('');
  const [category, setCategory] = useState<'JEE' | 'NEET' | 'Boards' | 'Foundation'>('Boards');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [existingPhoto, setExistingPhoto] = useState('');

  const fetchAchievers = async () => {
    setLoading(true);
    try {
      const data = await api.get('/achievers');
      setAchievers(data);
    } catch (err) {
      console.error('Error loading achievers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievers();
  }, []);

  const handleOpenAdd = () => {
    setName('');
    setSchool('');
    setMarks('');
    setRank('');
    setAchievement('');
    setCategory('Boards');
    setYear(new Date().getFullYear().toString());
    setPhotoFile(null);
    setExistingPhoto('');
    setEditingId(null);
    setFormMode('add');
  };

  const handleOpenEdit = (ach: Achiever) => {
    setEditingId(ach._id);
    setName(ach.name);
    setSchool(ach.school || '');
    setMarks(ach.marks || '');
    setRank(ach.rank || '');
    setAchievement(ach.achievement);
    setCategory(ach.category);
    setYear(ach.year || new Date().getFullYear().toString());
    setPhotoFile(null);
    setExistingPhoto(ach.photo || '');
    setFormMode('edit');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !achievement || !category) {
      addToast('Validation Error', 'Please fill in Name, Achievement, and Category.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('school', school);
    formData.append('marks', marks);
    formData.append('rank', rank);
    formData.append('achievement', achievement);
    formData.append('category', category);
    formData.append('year', year);
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    setIsSaving(true);
    showLoader(formMode === 'add' ? 'Creating topper achiever profile...' : 'Saving topper changes...');
    try {
      if (formMode === 'add') {
        await api.post('/achievers', formData, true);
        addToast('Topper Created', `Successfully added achiever profile for ${name}.`, 'success');
      } else {
        await api.put(`/achievers/${editingId}`, formData, true);
        addToast('Topper Updated', `Successfully modified details for topper ${name}.`, 'success');
      }
      setFormMode('list');
      fetchAchievers();
    } catch (err: any) {
      addToast('Error saving topper', err.message || 'Failed to save topper profile.', 'error');
    } finally {
      setIsSaving(false);
      hideLoader();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topper achiever profile?')) return;
    setDeletingId(id);
    showLoader('Deleting topper profile...');
    try {
      await api.delete(`/achievers/${id}`);
      addToast('Topper Profile Deleted', 'Successfully deleted achiever profile.', 'success');
      fetchAchievers();
    } catch (err: any) {
      addToast('Delete Failed', err.message || 'Failed to delete topper.', 'error');
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
    <div className="flex flex-col gap-6">
      
      {/* Title Header with Add CTA */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-extrabold text-brand-dark text-lg flex items-center gap-2">
          <Trophy className="text-brand-accent" size={20} />
          Student Results & Achievers Management
        </h3>
        
        {formMode === 'list' && (
          <button
            onClick={handleOpenAdd}
            className="bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-bold py-2.5 px-5 rounded-full flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus size={15} />
            Add Topper
          </button>
        )}
      </div>

      {formMode === 'list' ? (
        loading ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center animate-pulse">
            <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : achievers.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-500 text-xs">
            No toppers records in database. Click "Add Topper" to create one.
          </div>
        ) : (
          /* Table Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {achievers.map((ach) => (
              <div 
                key={ach._id}
                className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-slate-200"
              >
                <div>
                  {/* Photo Thumbnail */}
                  <div className="w-full h-36 bg-slate-50 rounded-xl overflow-hidden mb-4 border border-slate-100 relative">
                    {ach.photo ? (
                      <img 
                        src={getImageUrl(ach.photo)} 
                        alt={ach.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">No Image</div>
                    )}
                    <span className="absolute top-2.5 left-2.5 text-[9px] font-bold bg-brand-dark text-white px-2 py-0.5 rounded-md uppercase">
                      {ach.category}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-brand-dark truncate">{ach.name}</h4>
                  <span className="text-[10px] text-slate-400 block">{ach.school || 'No School logged'}</span>
                  
                  <div className="bg-slate-50 border border-slate-100/70 p-2.5 rounded-xl text-xs mt-3 flex flex-col gap-0.5">
                    <span className="font-bold text-slate-700 truncate">{ach.achievement}</span>
                    <span className="text-[10px] text-brand-accent font-semibold">Marks: {ach.marks || 'N/A'} | {ach.rank || 'No Rank'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(ach)}
                    className="p-2 border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-brand-dark rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                    title="Edit details"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(ach._id)}
                    disabled={deletingId !== null}
                    className="p-2 border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-750 rounded-xl flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50"
                    title="Delete topper profile"
                  >
                    {deletingId === ach._id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Form view for Add/Edit */
        <form onSubmit={handleSubmit} className="bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm text-xs flex flex-col gap-4 max-w-2xl">
          <h4 className="font-bold text-brand-dark text-base mb-2">
            {formMode === 'add' ? 'Create Topper Record' : 'Edit Topper Details'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Student Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Dixit"
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Target School Name</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. DPS Kalyanpur"
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Category Section *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl bg-white focus:border-brand-accent text-xs"
              >
                <option value="Boards">Boards (Class 11-12 / Topper)</option>
                <option value="JEE">IIT-JEE Qualified</option>
                <option value="NEET">NEET Qualified</option>
                <option value="Foundation">Foundation (Class 6-10)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Passing Target Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2024"
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Score Marks (Optional)</label>
              <input
                type="text"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="e.g. 98.6% or 685/720"
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Rank secured (Optional)</label>
              <input
                type="text"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="e.g. AIR 512 or School Rank 1"
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-600">Achievement Description *</label>
            <input
              type="text"
              value={achievement}
              onChange={(e) => setAchievement(e.target.value)}
              placeholder="e.g. Class 12th Board PCM Topper"
              className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
            />
          </div>

          {/* Photo upload box */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-slate-600">Topper Photo Attachment</span>
            <div className="flex items-center gap-4">
              <label className="border border-dashed border-slate-400 hover:bg-slate-50 py-3 px-5 rounded-xl cursor-pointer flex items-center gap-1.5 text-xs text-slate-600 font-bold transition-all">
                <Upload size={14} />
                Choose File
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
              <div className="text-slate-400 text-[10px]">
                {photoFile ? (
                  <span className="text-green-600 font-bold">Selected: {photoFile.name}</span>
                ) : (
                  <span>PNG, JPG, JPEG, WEBP. Automatic compress supported.</span>
                )}
              </div>
            </div>
            {existingPhoto && !photoFile && (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-slate-400">Current Photo:</span>
                <img 
                  src={getImageUrl(existingPhoto)} 
                  alt="Existing Topper" 
                  className="w-10 h-10 object-cover rounded-md border" 
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 border-t border-slate-100 pt-5 mt-3">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-brand-dark hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              Save Achiever Profile
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

export default AchieverManager;
