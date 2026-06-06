import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Bell, Calendar } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

interface Notice {
  _id: string;
  title: string;
  content?: string;
  type: 'Admissions Open' | 'Scholarship Tests' | 'New Batch Launch' | 'Exam Schedule' | 'Parent Meetings';
  isActive: boolean;
  scheduleDate: string;
}

export const NoticeManager: React.FC = () => {
  const { addToast } = useToast();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Inputs
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<Notice['type']>('New Batch Launch');
  const [isActive, setIsActive] = useState(true);
  const [scheduleDate, setScheduleDate] = useState('');

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const data = await api.get('/notices/all');
      setNotices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleOpenAdd = () => {
    setTitle('');
    setContent('');
    setType('New Batch Launch');
    setIsActive(true);
    // Default to current datetime in YYYY-MM-DDThh:mm format for HTML datetime-local input
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setScheduleDate(now.toISOString().slice(0, 16));
    setEditingId(null);
    setFormMode('add');
  };

  const handleOpenEdit = (n: Notice) => {
    setEditingId(n._id);
    setTitle(n.title);
    setContent(n.content || '');
    setType(n.type);
    setIsActive(n.isActive);
    // Convert ISO date string to YYYY-MM-DDThh:mm format
    const dt = new Date(n.scheduleDate);
    dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
    setScheduleDate(dt.toISOString().slice(0, 16));
    setFormMode('edit');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !type) {
      addToast('Validation Error', 'Please fill in Title and Select Type.', 'error');
      return;
    }

    const payload = {
      title,
      content,
      type,
      isActive,
      scheduleDate: scheduleDate ? new Date(scheduleDate).toISOString() : new Date().toISOString()
    };

    try {
      if (formMode === 'add') {
        await api.post('/notices', payload);
        addToast('Notice Created', `Successfully posted announcement bulletin: "${title}".`, 'success');
      } else {
        await api.put(`/notices/${editingId}`, payload);
        addToast('Notice Updated', `Successfully updated notice: "${title}".`, 'success');
      }
      setFormMode('list');
      fetchNotices();
    } catch (err: any) {
      addToast('Error saving notice', err.message || 'Action failed.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice board announcement?')) return;
    try {
      await api.delete(`/notices/${id}`);
      addToast('Notice Deleted', 'Announcement bulletin removed successfully.', 'success');
      fetchNotices();
    } catch (err: any) {
      addToast('Error deleting notice', err.message || 'Action failed.', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 text-xs animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-extrabold text-brand-dark text-lg flex items-center gap-2">
          <Bell className="text-brand-accent" size={20} />
          Announcements & Notice Board Manager
        </h3>
        {formMode === 'list' && (
          <button
            onClick={handleOpenAdd}
            className="bg-brand-accent hover:bg-brand-accentHover text-white text-xs font-bold py-2.5 px-5 rounded-full flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus size={15} />
            Post Notice
          </button>
        )}
      </div>

      {formMode === 'list' ? (
        loading ? (
          <div className="bg-white border p-10 text-center rounded-2xl animate-pulse">
            <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white border rounded-2xl p-12 text-center text-slate-500">
            No notices published. Click "Post Notice" to make an announcement.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {notices.map((n) => (
              <div 
                key={n._id} 
                className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-slate-100 border px-2 py-0.5 rounded text-[9px] text-slate-500 font-bold uppercase">
                      {n.type}
                    </span>
                    <span className={`text-[9px] font-bold py-0.5 px-2.5 rounded-full ${
                      n.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {n.isActive ? 'Active Live' : 'Hidden'}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-brand-dark text-sm leading-snug">{n.title}</h4>
                  {n.content && <p className="text-slate-500 line-clamp-2 mt-1 leading-relaxed">{n.content}</p>}
                  
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mt-2 font-medium">
                    <Calendar size={12} />
                    <span>Scheduled for: {new Date(n.scheduleDate).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 sm:mt-0 border-t sm:border-t-0 pt-3 sm:pt-0 shrink-0 self-end sm:self-center">
                  <button onClick={() => handleOpenEdit(n)} className="p-2 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl flex items-center justify-center cursor-pointer">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(n._id)} className="p-2 border border-red-100 text-red-500 hover:bg-red-50 rounded-xl flex items-center justify-center cursor-pointer">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-100 p-6 md:p-8 rounded-2xl shadow-sm text-xs flex flex-col gap-4 max-w-2xl">
          <h4 className="font-bold text-brand-dark text-base border-b pb-2">
            {formMode === 'add' ? 'Publish New Announcement' : 'Edit Announcement Details'}
          </h4>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-600">Notice Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. New Batch starting for JEE Mains & Advanced Droppers"
              className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Notice Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl bg-white focus:border-brand-accent text-xs"
              >
                <option value="Admissions Open">Admissions Open</option>
                <option value="Scholarship Tests">Scholarship Tests (AIST)</option>
                <option value="New Batch Launch">New Batch Launch</option>
                <option value="Exam Schedule">Exam Schedule</option>
                <option value="Parent Meetings">Parent Meetings</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-600">Schedule Display Date/Time *</label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl focus:border-brand-accent text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-slate-600">Notice Description details</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Enter comprehensive announcement paragraphs detail. Clear syllabus lists, office counter instructions, exam duration hours..."
              className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl resize-none focus:border-brand-accent text-xs"
            />
          </div>

          <div className="flex items-center gap-2 border-t pt-4 mt-1 bg-slate-50 p-3 rounded-xl border">
            <input
              type="checkbox"
              id="isActiveCheck"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-brand-accent focus:ring-brand-accent rounded"
            />
            <label htmlFor="isActiveCheck" className="font-bold text-slate-700 cursor-pointer">
              Publish Live Ticker immediately (Visible on homepage notice lists)
            </label>
          </div>

          <div className="flex items-center gap-3 border-t pt-5 mt-3">
            <button type="submit" className="bg-brand-dark hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl cursor-pointer">
              Save Announcement
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

export default NoticeManager;
