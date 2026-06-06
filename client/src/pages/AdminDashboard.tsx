import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Trophy, Bell, Settings, MessageSquare, Megaphone,
  Image as ImageIcon, LogOut, LayoutDashboard, FileText, ArrowRight, ShieldCheck, ChevronRight, Menu, X 
} from 'lucide-react';
import api from '../utils/api';

// Sub-components
import LeadCRM from './admin/LeadCRM';
import AchieverManager from './admin/AchieverManager';
import TestimonialManager from './admin/TestimonialManager';
import FacultyManager from './admin/FacultyManager';
import GalleryManager from './admin/GalleryManager';
import BlogManager from './admin/BlogManager';
import NoticeManager from './admin/NoticeManager';
import SettingsManager from './admin/SettingsManager';
import NotificationCenter from './admin/NotificationCenter';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  totalAchievers: number;
  totalFaculty: number;
  totalTestimonials: number;
  totalBlogs: number;
  totalGallery: number;
}

interface RecentLead {
  _id: string;
  studentName: string;
  class: string;
  course: string;
  status: string;
  createdAt: string;
}

export const AdminDashboard: React.FC = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'crm' | 'achievers' | 'faculty' | 'testimonials' | 'gallery' | 'blogs' | 'notices' | 'settings' | 'notifications'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const selectTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const loadUnreadCount = async () => {
    try {
      const data = await api.get('/notifications');
      setUnreadCount(data.filter((n: any) => !n.read).length);
    } catch (err) {
      console.error('Error loading unread count:', err);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await api.get('/dashboard/stats');
      setStats(statsData);
      
      const leadsData = await api.get('/leads');
      setRecentLeads(leadsData.slice(0, 5)); // Fetch latest 5
      
      await loadUnreadCount();
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Admin Control Panel - Aman Indra Classes';
    loadStats();
  }, [activeTab]);

  useEffect(() => {
    // Force light mode theme inside admin panel dashboard
    const root = window.document.documentElement;
    const hadDark = root.classList.contains('dark');
    if (hadDark) {
      root.classList.remove('dark');
    }
    return () => {
      if (hadDark) {
        root.classList.add('dark');
      }
    };
  }, []);

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'New': return 'bg-blue-50 text-blue-750 border-blue-100';
      case 'Contacted': return 'bg-slate-100 text-slate-600';
      case 'Follow Up': return 'bg-purple-50 text-purple-750';
      case 'Interested': return 'bg-orange-50 text-orange-750';
      case 'Converted': return 'bg-emerald-50 text-emerald-750';
      default: return 'bg-red-50 text-red-750';
    }
  };

  // Render correct admin view panel
  const renderTabContent = () => {
    switch (activeTab) {
      case 'crm': return <LeadCRM />;
      case 'achievers': return <AchieverManager />;
      case 'faculty': return <FacultyManager />;
      case 'testimonials': return <TestimonialManager />;
      case 'gallery': return <GalleryManager />;
      case 'blogs': return <BlogManager />;
      case 'notices': return <NoticeManager />;
      case 'settings': return <SettingsManager />;
      case 'notifications': return <NotificationCenter onGoToTab={setActiveTab} onRefreshUnreadCount={loadUnreadCount} />;
      default: return renderOverview();
    }
  };

  const renderOverview = () => {
    if (loading) {
      return (
        <div className="bg-white border rounded-3xl p-10 text-center animate-pulse">
          <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-slate-400 text-xs font-bold">Aggregating database details...</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-8 text-xs animate-fade-in">
        
        {/* Count Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div 
            onClick={() => setActiveTab('crm')}
            className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col gap-4 relative group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wide text-[10px]">Total Leads</span>
              <div className="font-extrabold text-2xl text-brand-dark mt-1 flex items-baseline gap-2">
                {stats?.totalLeads || 0}
                {stats?.newLeads && stats.newLeads > 0 ? (
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-extrabold animate-pulse">
                    {stats.newLeads} new
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('achievers')}
            className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col gap-4 relative group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-accent flex items-center justify-center">
              <Trophy size={20} />
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wide text-[10px]">Topper Achievers</span>
              <div className="font-extrabold text-2xl text-brand-dark mt-1">{stats?.totalAchievers || 0}</div>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('blogs')}
            className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col gap-4 relative group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wide text-[10px]">Blog Articles</span>
              <div className="font-extrabold text-2xl text-brand-dark mt-1">{stats?.totalBlogs || 0}</div>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('gallery')}
            className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col gap-4 relative group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ImageIcon size={20} />
            </div>
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wide text-[10px]">Gallery Photos</span>
              <div className="font-extrabold text-2xl text-brand-dark mt-1">{stats?.totalGallery || 0}</div>
            </div>
          </div>

        </div>

        {/* Recent Enquiries & Shortcuts */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Recent Leads list */}
          <div className="xl:col-span-8 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-extrabold text-sm text-brand-dark">Recent Lead Enquiries</h4>
              <button 
                onClick={() => setActiveTab('crm')} 
                className="text-[10px] text-brand-accent hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
              >
                Go to CRM
                <ArrowRight size={12} />
              </button>
            </div>

            {recentLeads.length === 0 ? (
              <span className="text-slate-450 italic py-6 block text-center">No leads registered yet.</span>
            ) : (
              <div className="overflow-x-auto text-[11px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3">Student</th>
                      <th className="py-2.5 px-3">Interest Target</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentLeads.map((rl) => (
                      <tr 
                        key={rl._id}
                        onClick={() => { setActiveTab('crm'); }}
                        className="hover:bg-slate-50 cursor-pointer"
                      >
                        <td className="py-3 px-3 font-extrabold text-brand-dark text-sm">{rl.studentName}</td>
                        <td className="py-3 px-3 font-medium text-slate-600">{rl.class} | {rl.course}</td>
                        <td className="py-3 px-3">
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${getStatusColor(rl.status)}`}>
                            {rl.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-455">{new Date(rl.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick shortcuts Right */}
          <div className="xl:col-span-4 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col gap-4">
            <h4 className="font-extrabold text-sm text-brand-dark border-b pb-3">Quick Actions Shortcuts</h4>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab('crm')}
                className="w-full text-left bg-slate-50 hover:bg-slate-100 border p-3 rounded-xl font-bold flex items-center justify-between text-slate-700"
              >
                <span>Browse CRM Pipeline</span>
                <ChevronRight size={14} className="text-slate-400" />
              </button>
              <button 
                onClick={() => setActiveTab('notices')}
                className="w-full text-left bg-slate-50 hover:bg-slate-100 border p-3 rounded-xl font-bold flex items-center justify-between text-slate-700"
              >
                <span>Announce scholarship Test</span>
                <ChevronRight size={14} className="text-slate-400" />
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className="w-full text-left bg-slate-50 hover:bg-slate-100 border p-3 rounded-xl font-bold flex items-center justify-between text-slate-700"
              >
                <span>Edit Hero Headings / Phone</span>
                <ChevronRight size={14} className="text-slate-400" />
              </button>
            </div>
          </div>

        </div>

      </div>
    );
  };

  // Helper trigger to auto open drawer in CRM tab


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row relative">
      
      {/* Mobile Top Header Bar */}
      <header className="lg:hidden bg-brand-dark text-white h-16 px-6 flex items-center justify-between border-b border-slate-800 sticky top-0 z-30 w-full shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            title="Open Menu"
          >
            <Menu size={22} />
          </button>
          <span className="font-extrabold text-sm tracking-tight">AIC CONTROL</span>
        </div>
        <div className="text-[10px] bg-brand-accent text-brand-dark px-2.5 py-1 rounded-full font-extrabold uppercase tracking-wider">
          {activeTab}
        </div>
      </header>

      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1. Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark text-slate-400 p-6 flex flex-col justify-between shrink-0 border-r border-slate-800 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col gap-8">
          
          {/* Brand header with Mobile Close CTA */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-brand-accent">
                <ShieldCheck size={20} />
              </div>
              <div>
                <span className="font-extrabold text-white text-sm block tracking-tight">AIC CONTROL</span>
                <span className="text-[9px] font-bold tracking-widest uppercase text-brand-accent -mt-0.5 block">Admin Console</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              title="Close Menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav List */}
          <nav className="flex flex-col gap-1.5 font-bold text-xs">
            <button
              onClick={() => selectTab('overview')}
              className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'bg-brand-accent text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard size={16} />
              Overview Hub
            </button>
            
            <button
              onClick={() => selectTab('crm')}
              className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === 'crm' ? 'bg-brand-accent text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users size={16} />
              CRM leads Board
            </button>

            <button
              onClick={() => selectTab('achievers')}
              className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === 'achievers' ? 'bg-brand-accent text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Trophy size={16} />
              Toppers Results
            </button>

            <button
              onClick={() => selectTab('faculty')}
              className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === 'faculty' ? 'bg-brand-accent text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users size={16} />
              Faculty Members
            </button>

            <button
              onClick={() => selectTab('testimonials')}
              className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === 'testimonials' ? 'bg-brand-accent text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <MessageSquare size={16} />
              Testimonials
            </button>

            <button
              onClick={() => selectTab('gallery')}
              className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === 'gallery' ? 'bg-brand-accent text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ImageIcon size={16} />
              Gallery photos
            </button>

            <button
              onClick={() => selectTab('blogs')}
              className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === 'blogs' ? 'bg-brand-accent text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText size={16} />
              Prep Blogs strategy
            </button>

            <button
              onClick={() => selectTab('notices')}
              className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === 'notices' ? 'bg-brand-accent text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Megaphone size={16} />
              Notice Bulletins
            </button>

            <button
              onClick={() => selectTab('notifications')}
              className={`w-full text-left py-3 px-4 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'notifications' ? 'bg-brand-accent text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell size={16} />
                <span>Notification Center</span>
              </div>
              {unreadCount > 0 && (
                <span className="text-[9px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-full animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => selectTab('settings')}
              className={`w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                activeTab === 'settings' ? 'bg-brand-accent text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings size={16} />
              Website Settings
            </button>
          </nav>
        </div>

        {/* Footer logout area */}
        <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center font-bold text-white text-[10px]">
              AD
            </div>
            <div>
              <span className="text-[10px] text-white block truncate w-36 font-semibold" title={admin?.email}>{admin?.email}</span>
              <span className="text-[8px] text-slate-500 uppercase font-bold block">Active Operator</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-center">
            <Link to="/" className="bg-slate-800 hover:bg-slate-700 text-white py-2 px-1 rounded-lg">View Site</Link>
            <button 
              onClick={handleLogoutClick}
              className="bg-red-650 hover:bg-red-700 text-white py-2 px-1 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
            >
              <LogOut size={10} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content viewport */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {renderTabContent()}
      </main>

    </div>
  );
};

export default AdminDashboard;
