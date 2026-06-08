import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Trash2, FileText, 
  Download, MessageSquare, 
  Clock, Loader2, MapPin, User 
} from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { useLoading } from '../../context/LoadingContext';

interface Note {
  _id?: string;
  text: string;
  date: string;
  author: string;
}

interface Lead {
  _id: string;
  studentName: string;
  parentName: string;
  phone: string;
  email?: string;
  class: string;
  schoolName?: string;
  course: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Follow Up' | 'Interested' | 'Converted' | 'Not Interested';
  type: 'Enquiry' | 'Scholarship';
  notes: Note[];
  createdAt: string;
}

export const LeadCRM: React.FC = () => {
  const { addToast } = useToast();
  const { showLoader, hideLoader } = useLoading();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Filters state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [course, setCourse] = useState('');
  const [studentClass, setStudentClass] = useState('');
  
  // Note inputs
  const [newNote, setNewNote] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (type) params.append('type', type);
      if (course) params.append('course', course);
      if (studentClass) params.append('class', studentClass);

      const data = await api.get(`/leads?${params.toString()}`);
      setLeads(data);
      
      // Update selected lead if it's currently open
      if (selectedLead) {
        const updated = data.find((l: Lead) => l._id === selectedLead._id);
        if (updated) setSelectedLead(updated);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [status, type, course, studentClass]); // Trigger auto on select toggles

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    setUpdatingStatusId(leadId);
    showLoader(`Updating status to "${newStatus}"...`);
    try {
      await api.put(`/leads/${leadId}`, { status: newStatus });
      addToast('Status Updated', `Lead status changed to "${newStatus}".`, 'success');
      // If the selected lead is active, refresh its details too
      if (selectedLead && selectedLead._id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, status: newStatus as Lead['status'] } : null);
      }
      fetchLeads();
    } catch (err: any) {
      addToast('Error updating status', err.message || 'Failed to update status.', 'error');
    } finally {
      setUpdatingStatusId(null);
      hideLoader();
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNote.trim()) return;

    setIsSavingNote(true);
    showLoader('Adding follow-up note to lead record...');
    try {
      const data = await api.put(`/leads/${selectedLead._id}`, {
        noteText: newNote,
        noteAuthor: 'Admin Officer'
      });
      setNewNote('');
      addToast('Note Added', 'CRM follow-up note saved successfully.', 'success');
      // Refresh selected lead's notes dynamically
      if (data && data.lead) {
        setSelectedLead(data.lead);
      } else {
        fetchLeads();
      }
    } catch (err: any) {
      addToast('Error adding note', err.message || 'Failed to add CRM note.', 'error');
    } finally {
      setIsSavingNote(false);
      hideLoader();
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead from CRM database?')) return;
    setDeletingId(leadId);
    showLoader('Deleting lead record...');
    try {
      await api.delete(`/leads/${leadId}`);
      setSelectedLead(null);
      addToast('Lead Deleted', 'Admission lead deleted from database.', 'success');
      fetchLeads();
    } catch (err: any) {
      addToast('Error deleting lead', err.message || 'Failed to delete lead.', 'error');
    } finally {
      setDeletingId(null);
      hideLoader();
    }
  };

  const triggerExport = (format: 'csv' | 'xlsx') => {
    const params = new URLSearchParams();
    if (course) params.append('course', course);
    if (studentClass) params.append('studentClass', studentClass);
    
    const endpoint = `/leads/export/${format}?${params.toString()}`;
    const filename = `AIC_Leads_Report_${format === 'csv' ? 'export.csv' : 'export.xlsx'}`;
    
    setIsExporting(true);
    showLoader(`Generating and downloading ${format.toUpperCase()} report...`);
    api.downloadBlob(endpoint, filename)
      .then(() => {
        addToast('Export Successful', `Successfully generated and downloaded ${format.toUpperCase()} report.`, 'success');
      })
      .catch(() => addToast('Export Failed', 'Failed to generate export file.', 'error'))
      .finally(() => {
        setIsExporting(false);
        hideLoader();
      });
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Contacted':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Follow Up':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Interested':
        return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'Converted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Not Interested':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      
      {/* CRM Main Leads list area */}
      <div className={`${selectedLead ? 'xl:col-span-8' : 'xl:col-span-12'} flex flex-col gap-6`}>
        
        {/* Filters Header bar */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-extrabold text-base text-brand-dark flex items-center gap-2">
              <Filter size={18} className="text-brand-accent" />
              Admissions CRM Leads filter
            </h3>
            
            {/* Export buttons */}
            <div className="flex gap-2 text-xs">
              <button 
                onClick={() => triggerExport('xlsx')}
                disabled={isExporting}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-xl border border-slate-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                Excel Report
              </button>
              <button 
                onClick={() => triggerExport('csv')}
                disabled={isExporting}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-xl border border-slate-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isExporting ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                CSV Report
              </button>
            </div>
          </div>

          {/* Form Filter selectors */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search name, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-slate-200 bg-white text-slate-800 outline-none py-2 pl-8 pr-3 rounded-xl focus:border-brand-accent"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
            </div>

            {/* Status */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl bg-white"
            >
              <option value="">All Statuses</option>
              <option value="New">New Enquiry</option>
              <option value="Contacted">Contacted</option>
              <option value="Follow Up">Follow Up</option>
              <option value="Interested">Interested</option>
              <option value="Converted">Converted</option>
              <option value="Not Interested">Not Interested</option>
            </select>

            {/* Type */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl bg-white"
            >
              <option value="">All Lead Types</option>
              <option value="Enquiry">Enquiry Form</option>
              <option value="Scholarship">Scholarship AIST</option>
            </select>

            {/* Class */}
            <select
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl bg-white"
            >
              <option value="">All Classes</option>
              <option value="Class 6">Class 6th</option>
              <option value="Class 7">Class 7th</option>
              <option value="Class 8">Class 8th</option>
              <option value="Class 9">Class 9th</option>
              <option value="Class 10">Class 10th</option>
              <option value="Class 11">Class 11th</option>
              <option value="Class 12">Class 12th</option>
              <option value="Dropper">Target JEE/NEET</option>
            </select>

            {/* Course */}
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl bg-white"
            >
              <option value="">All Programs</option>
              <option value="Foundation Program (Class 6-8)">Foundation (Class 6-8)</option>
              <option value="Academic Excellence (Class 9-10)">Academic Excellence (Class 9-10)</option>
              <option value="Board Prep (Class 11-12)">Boards Prep</option>
              <option value="IIT-JEE Preparation">IIT-JEE Prep</option>
              <option value="NEET Preparation">NEET Prep</option>
            </select>

            <button
              type="submit"
              className="bg-brand-dark hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl cursor-pointer"
            >
              Apply Filter
            </button>
          </form>
        </div>

        {/* Lead Rows Table / List */}
        {loading ? (
          <div className="bg-white p-10 border border-slate-100 rounded-2xl text-center">
            <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white p-12 border border-slate-100 rounded-2xl text-center text-slate-500 text-xs">
            No leads matching the filtered criteria were found in database.
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Student & Parent</th>
                    <th className="py-3.5 px-4">Contact Detail</th>
                    <th className="py-3.5 px-4">Academic Interests</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">CRM Status</th>
                    <th className="py-3.5 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {leads.map((l) => (
                    <tr 
                      key={l._id}
                      onClick={() => setSelectedLead(l)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        selectedLead?._id === l._id ? 'bg-slate-50 font-medium' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span className="font-extrabold text-brand-dark block text-sm">{l.studentName}</span>
                        <span className="text-[10px] text-slate-400 block -mt-0.5">Parent: {l.parentName}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="block">{l.phone}</span>
                        {l.email && <span className="text-[10px] text-slate-400 block">{l.email}</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-700 block">{l.class}</span>
                        <span className="text-[10px] text-slate-400 block">{l.course}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold py-0.5 px-2 rounded-md ${
                          l.type === 'Scholarship' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {l.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-extrabold py-0.5 px-2.5 rounded-full border ${getStatusColor(l.status)}`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[10px]">
                        {new Date(l.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CRM Details Sidebar Panel */}
      {selectedLead && (
        <div className="xl:col-span-4 bg-white border border-slate-100 rounded-2xl shadow-lg p-6 flex flex-col gap-6 animate-slide-up sticky top-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h4 className="font-extrabold text-brand-dark text-base">Lead Information Card</h4>
            <button 
              onClick={() => setSelectedLead(null)}
              className="text-slate-400 hover:text-brand-dark p-1 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Details list */}
          <div className="flex flex-col gap-4 text-xs">
            
            <div className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <User className="text-brand-accent shrink-0 mt-0.5" size={16} />
              <div className="flex-1">
                <span className="font-bold text-[10px] text-slate-400 uppercase block">Student & Parent</span>
                <strong className="text-brand-dark text-sm block mt-0.5">{selectedLead.studentName}</strong>
                <span className="text-slate-500 block">Father/Mother: {selectedLead.parentName}</span>
                <span className="text-slate-500 block mt-1">Phone: {selectedLead.phone}</span>
                {selectedLead.email && <span className="text-slate-500 block">Email: {selectedLead.email}</span>}
              </div>
            </div>

            <div className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <MapPin className="text-brand-accent shrink-0 mt-0.5" size={16} />
              <div className="flex-1">
                <span className="font-bold text-[10px] text-slate-400 uppercase block">Education Target</span>
                <strong className="text-brand-dark block mt-0.5">{selectedLead.class}</strong>
                <span className="text-slate-500 block">Program: {selectedLead.course}</span>
                {selectedLead.schoolName && <span className="text-slate-500 block">School: {selectedLead.schoolName}</span>}
              </div>
            </div>

            {selectedLead.message && (
              <div className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <Clock className="text-brand-accent shrink-0 mt-0.5" size={16} />
                <div className="flex-1">
                  <span className="font-bold text-[10px] text-slate-400 uppercase block">Message Submitted</span>
                  <p className="text-slate-600 leading-relaxed mt-1">{selectedLead.message}</p>
                </div>
              </div>
            )}

            {/* Update Status Dropdown */}
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-slate-600">Update Lead CRM Status</span>
              <select
                value={selectedLead.status}
                onChange={(e) => handleUpdateStatus(selectedLead._id, e.target.value)}
                disabled={updatingStatusId !== null}
                className="w-full border border-slate-200 bg-white text-slate-800 outline-none py-2 px-3 rounded-xl bg-white focus:border-brand-accent text-xs disabled:opacity-50"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Follow Up">Follow Up</option>
                <option value="Interested">Interested</option>
                <option value="Converted">Converted</option>
                <option value="Not Interested">Not Interested</option>
              </select>
            </div>

            {/* Audit Notes CRM Feed */}
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
              <span className="font-bold text-slate-600 flex items-center gap-1">
                <MessageSquare size={14} className="text-brand-accent" />
                Interactions Log ({selectedLead.notes.length})
              </span>
              
              <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                {selectedLead.notes.length === 0 ? (
                  <span className="text-[10px] text-slate-400 italic">No staff notes logged yet. Use form below to update.</span>
                ) : (
                  selectedLead.notes.map((note, idx) => (
                    <div key={note._id || idx} className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex flex-col gap-1">
                      <p className="text-slate-600 leading-relaxed font-medium">{note.text}</p>
                      <span className="text-[9px] text-slate-400 self-end">
                        By {note.author} on {new Date(note.date).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2 mt-1">
                <input
                  type="text"
                  placeholder="Type notes (e.g. Called, scheduled counseling for next Sunday)"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 border border-slate-200 bg-white text-slate-800 outline-none py-1.5 px-3 rounded-xl focus:border-brand-accent text-xs"
                />
                <button
                  type="submit"
                  disabled={isSavingNote}
                  className="bg-brand-accent hover:bg-brand-accentHover text-white py-1.5 px-3 rounded-xl font-bold cursor-pointer flex items-center gap-1 disabled:opacity-50"
                >
                  {isSavingNote && <Loader2 size={12} className="animate-spin" />}
                  Add
                </button>
              </form>
            </div>

            {/* Delete Lead Button */}
            <div className="border-t border-slate-100 pt-4 mt-2">
              <button
                onClick={() => handleDeleteLead(selectedLead._id)}
                disabled={deletingId !== null}
                className="w-full border border-red-150 hover:bg-red-50 text-red-600 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer text-xs transition-colors disabled:opacity-50"
              >
                {deletingId === selectedLead._id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Delete Lead Record
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default LeadCRM;
