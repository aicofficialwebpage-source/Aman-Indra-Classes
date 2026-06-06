import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Users, Upload } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

interface Faculty {
  _id: string;
  name: string;
  photo?: string;
  subject: string;
  qualification: string;
  experience: string;
  bio?: string;
  orderIndex: number;
}

export const FacultyManager: React.FC = () => {
  const { addToast } = useToast();
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Inputs
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [existingPhoto, setExistingPhoto] = useState('');

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const data = await api.get('/faculty');
      setFaculty(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleOpenAdd = () => {
    setName('');
    setSubject('');
    setQualification('');
    setExperience('');
    setBio('');
    setOrderIndex(0);
    setPhotoFile(null);
    setExistingPhoto('');
    setEditingId(null);
    setFormMode('add');
  };

  const handleOpenEdit = (f: Faculty) => {
    setEditingId(f._id);
    setName(f.name);
    setSubject(f.subject);
    setQualification(f.qualification);
    setExperience(f.experience);
    setBio(f.bio || '');
    setOrderIndex(f.orderIndex);
    setPhotoFile(null);
    setExistingPhoto(f.photo || '');
    setFormMode('edit');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !subject || !qualification || !experience) {
      addToast('Validation Error', 'Please fill in Name, Subject, Qualification, and Experience.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('subject', subject);
    formData.append('qualification', qualification);
    formData.append('experience', experience);
    formData.append('bio', bio);
    formData.append('orderIndex', orderIndex.toString());
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    try {
      if (formMode === 'add') {
        await api.post('/faculty', formData, true);
        addToast('Teacher Profile Added', `Successfully added faculty profile for ${name}.`, 'success');
      } else {
        await api.put(`/faculty/${editingId}`, formData, true);
        addToast('Teacher Profile Updated', `Successfully modified faculty profile for ${name}.`, 'success');
      }
      setFormMode('list');
      fetchFaculty();
    } catch (err: any) {
      addToast('Error saving faculty', err.message || 'Failed to save faculty profile.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this faculty profile?')) return;
    try {
      await api.delete(`/faculty/${id}`);
      addToast('Teacher Profile Deleted', 'Successfully deleted faculty profile.', 'success');
      fetchFaculty();
    } catch (err: any) {
      addToast('Delete Failed', err.message || 'Failed to delete faculty.', 'error');
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
          <Users className="text-brand-accent" size={20} />
          Coaching Faculty Profiles Manager
        </h3>
        {formMode === 'list' && (
          <button
            onClick={handleOpenAdd}
            className="bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-bold py-2.5 px-5 rounded-full flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus size={15} />
            Add Faculty
          </button>
        )}
      </div>

      {formMode === 'list' ? (
        loading ? (
          <div className="bg-white border p-10 text-center rounded-2xl animate-pulse">
            <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : faculty.length === 0 ? (
          <div className="bg-white border rounded-2xl p-12 text-center text-slate-500">
            No faculty members logged. Click "Add Faculty" to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faculty.map((f) => (
              <div key={f._id} className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0 border">
                    {f.photo ? (
                      <img src={getImageUrl(f.photo)} alt={f.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">No Image</div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-brand-dark text-sm leading-tight">{f.name}</h4>
                    <span className="text-brand-accent font-semibold block mt-0.5">{f.subject}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Order Priority: {f.orderIndex}</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100/80 p-2.5 rounded-xl text-[10px] mt-3">
                  <span className="block font-bold text-slate-600">{f.qualification}</span>
                  <span className="block text-slate-500 font-medium">Exp: {f.experience}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-end gap-2">
                  <button onClick={() => handleOpenEdit(f)} className="p-2 border rounded-xl text-slate-500 hover:bg-slate-200 cursor-pointer">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(f._id)} className="p-2 border border-red-100 text-red-500 hover:bg-red-50 cursor-pointer">
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
            {formMode === 'add' ? 'Create Faculty Member' : 'Edit Faculty Member Details'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Faculty Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Prof. Aman Indra"
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Subject specialization *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Physics & Mentorship"
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Academic Qualifications *</label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="e.g. M.Tech, IIT Kanpur"
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Teaching Experience *</label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 12+ Years"
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-600">Order priority weight (e.g. 1 show first, 2 second)</label>
            <input
              type="number"
              value={orderIndex}
              onChange={(e) => setOrderIndex(Number(e.target.value))}
              placeholder="0"
              className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-600">Short Biography bio details</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Short statement on study philosophies or past track record..."
              className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl resize-none focus:border-brand-accent text-xs"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-bold text-slate-600">Faculty Portrait Photo</span>
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
                <img src={getImageUrl(existingPhoto)} alt="Existing faculty photo" className="w-10 h-10 object-cover rounded-md border" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 border-t pt-5 mt-3">
            <button type="submit" className="bg-brand-dark hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl cursor-pointer">
              Save Faculty Member
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

export default FacultyManager;
