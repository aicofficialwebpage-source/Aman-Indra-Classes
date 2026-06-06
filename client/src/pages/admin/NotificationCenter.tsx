import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Users, FileText, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'enquiry' | 'status_update' | 'note_added' | 'system';
  read: boolean;
  relatedId?: string;
  createdAt: string;
}

interface NotificationCenterProps {
  onGoToTab: (tab: any) => void;
  onRefreshUnreadCount: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onGoToTab, onRefreshUnreadCount }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.get('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all', {});
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      addToast('Success', 'All notifications marked as read.', 'success');
      onRefreshUnreadCount();
    } catch (err) {
      addToast('Error', 'Failed to update notifications.', 'error');
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}`, {});
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      onRefreshUnreadCount();
    } catch (err) {
      addToast('Error', 'Failed to mark notification as read.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      addToast('Success', 'Notification deleted.', 'success');
      onRefreshUnreadCount();
    } catch (err) {
      addToast('Error', 'Failed to delete notification.', 'error');
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'enquiry':
        return {
          icon: <Users size={16} />,
          color: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30'
        };
      case 'status_update':
        return {
          icon: <RefreshCw size={16} />,
          color: 'bg-yellow-50 text-brand-accent border-yellow-100 dark:bg-yellow-950/40 dark:text-brand-accent dark:border-yellow-900/30'
        };
      case 'note_added':
        return {
          icon: <FileText size={16} />,
          color: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/30'
        };
      default:
        return {
          icon: <Bell size={16} />,
          color: 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-800'
        };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-xs">
      
      {/* Title Header with actions */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
        <h3 className="font-extrabold text-brand-dark dark:text-white text-lg flex items-center gap-2">
          <Bell className="text-brand-accent" size={20} />
          Notification Alert Center
          {unreadCount > 0 && (
            <span className="text-[10px] bg-brand-accent text-brand-dark font-extrabold px-2 py-0.5 rounded-full">
              {unreadCount} Unread
            </span>
          )}
        </h3>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="bg-brand-accent hover:bg-brand-accentHover text-brand-dark text-xs font-bold py-2 px-4 rounded-full flex items-center gap-1 shadow-sm transition-all cursor-pointer"
          >
            <Check size={14} />
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20 rounded-2xl p-10 text-center animate-pulse">
          <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span className="text-slate-400 dark:text-slate-500 font-semibold">Syncing notification queue...</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-455">
          <AlertCircle size={28} className="mx-auto text-slate-300 dark:text-slate-500 mb-2" />
          No system notifications or lead updates received yet.
        </div>
      ) : (
        /* Notification feed */
        <div className="flex flex-col gap-3 max-w-3xl">
          {notifications.map((notif) => {
            const { icon, color } = getNotifIcon(notif.type);
            return (
              <div
                key={notif._id}
                className={`border rounded-2xl p-4 flex gap-4 items-start transition-all relative ${
                  notif.read
                    ? 'bg-white dark:bg-emerald-900/5 border-slate-100 dark:border-emerald-900/10 opacity-75'
                    : 'bg-white dark:bg-emerald-900/20 border-slate-200 dark:border-brand-accent/25 shadow-sm'
                }`}
              >
                {/* Type Icon */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${color}`}>
                  {icon}
                </div>

                {/* Main Body */}
                <div className="flex-1 flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-brand-dark dark:text-white">{notif.title}</span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-accent shrink-0 animate-ping" />
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{notif.message}</p>
                  
                  {/* Timestamp & CRM redirection links */}
                  <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                    <span>{new Date(notif.createdAt).toLocaleString('en-IN')}</span>
                    {notif.relatedId && (
                      <button
                        onClick={() => onGoToTab('crm')}
                        className="text-brand-accent hover:underline cursor-pointer font-bold"
                      >
                        Open Lead in CRM &rarr;
                      </button>
                    )}
                  </div>
                </div>

                {/* Control Actions */}
                <div className="flex items-center gap-1 shrink-0 self-center">
                  {!notif.read && (
                    <button
                      onClick={() => handleMarkRead(notif._id)}
                      className="p-2 border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                      title="Mark as read"
                    >
                      <CheckCircle size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif._id)}
                    className="p-2 border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
