'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/lib/AppContext';
import Link from 'next/link';
import { formatLocation } from '@/lib/utils';

type DashboardTab = 'overview' | 'applications' | 'saved';

interface Application {
  id: string;
  title: string;
  company: string;
  status: 'Submitted' | 'Under Review' | 'Interview Scheduled' | 'Rejected' | 'Offered';
  date: string;
}

interface SavedJob {
  id: number | string;
  title: string;
  company: string;
  logo: string;
  type: string;
  location: string;
  deadline: string;
}

const STATUSES: Application['status'][] = ['Submitted', 'Under Review', 'Interview Scheduled', 'Rejected', 'Offered'];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

function loadApplications(): Application[] {
  try {
    const raw = localStorage.getItem('sprouthr_applications');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveApplications(apps: Application[]) {
  localStorage.setItem('sprouthr_applications', JSON.stringify(apps));
}

function loadSavedJobs(): SavedJob[] {
  try {
    const raw = localStorage.getItem('sprouthr_saved_jobs');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export default function DashboardPage() {
  const { navigateTo, state } = useApp();
  const [tab, setTab] = useState<DashboardTab>('overview');

  // Persisted applications
  const [applications, setApplications] = useState<Application[]>([]);
  const [editApp, setEditApp] = useState<Partial<Application> | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Persisted saved jobs
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    setApplications(loadApplications());
    setSavedJobs(loadSavedJobs());
  }, []);

  // Listen for bookmark changes from other tabs — refresh on focus
  useEffect(() => {
    const handler = () => setSavedJobs(loadSavedJobs());
    window.addEventListener('focus', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('focus', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const persistApps = useCallback((apps: Application[]) => {
    setApplications(apps);
    saveApplications(apps);
  }, []);

  // Applications CRUD
  const addApplication = () => {
    if (!editApp?.title || !editApp?.company) return;
    const newApp: Application = {
      id: generateId(),
      title: editApp.title,
      company: editApp.company,
      status: editApp.status || 'Submitted',
      date: editApp.date || new Date().toISOString().split('T')[0],
    };
    persistApps([newApp, ...applications]);
    setEditApp(null);
    setShowForm(false);
  };

  const updateStatus = (id: string, status: Application['status']) => {
    persistApps(applications.map(a => a.id === id ? { ...a, status } : a));
  };

  const deleteApplication = (id: string) => {
    if (confirm('Delete this application?')) {
      persistApps(applications.filter(a => a.id !== id));
    }
  };

  // Remove saved job
  const removeSavedJob = (id: number | string) => {
    const saved = loadSavedJobs().filter(j => j.id !== id);
    localStorage.setItem('sprouthr_saved_jobs', JSON.stringify(saved));
    setSavedJobs(saved);
  };

  const interviewsCount = applications.filter(a => a.status === 'Interview Scheduled').length;

  const tabs: { id: DashboardTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
    { id: 'applications', label: 'My Applications', icon: 'fa-file-alt' },
    { id: 'saved', label: 'Saved', icon: 'fa-heart' },
  ];

  return (
    <div className="page-transition min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#22c55e] flex items-center justify-center text-white text-2xl font-bold">
            {state.user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {state.user?.user_metadata?.full_name || state.user?.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-gray-500">{state.user?.email || 'No email available'}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass rounded-2xl p-1.5 mb-8 inline-flex flex-wrap">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'accent-gradient text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
              <i className={`fas ${t.icon} mr-2`}></i>{t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: 'fa-file-alt', label: 'Applications', value: applications.length.toString(), color: 'text-[#22c55e]' },
                { icon: 'fa-heart', label: 'Saved', value: savedJobs.length.toString(), color: 'text-red-500' },
                { icon: 'fa-calendar-check', label: 'Interviews', value: interviewsCount.toString(), color: 'text-blue-500' },
              ].map(s => (
                <div key={s.label} className="glass rounded-2xl p-6">
                  <i className={`fas ${s.icon} text-xl ${s.color} mb-2`}></i>
                  <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Applications */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                <button onClick={() => { setShowForm(true); setEditApp({}); }} className="text-sm text-[#22c55e] hover:text-[#16a34a] font-medium transition-colors">
                  <i className="fas fa-plus mr-1"></i>Add
                </button>
              </div>
              {applications.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <i className="fas fa-file-alt text-3xl mb-2"></i>
                  <p className="text-sm">No applications yet. Track your job applications here!</p>
                  <button onClick={() => { setShowForm(true); setEditApp({}); }} className="mt-3 text-sm text-[#22c55e] hover:text-[#16a34a] font-medium">
                    <i className="fas fa-plus mr-1"></i>Add your first application
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map(app => (
                    <div key={app.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">{app.title}</p>
                        <p className="text-sm text-gray-500">{app.company}</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                          app.status === 'Interview Scheduled' ? 'bg-[#22c55e]/10 text-[#22c55e]' :
                          app.status === 'Under Review' ? 'bg-amber-500/10 text-amber-600' :
                          app.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                          app.status === 'Offered' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-600'
                        }`}>{app.status}</span>
                        <span className="text-xs text-gray-400">{app.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Need a portfolio? */}
            <div className="bg-gradient-to-r from-[#22c55e]/10 to-[#16a34a]/5 rounded-2xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#22c55e] flex items-center justify-center text-white">
                  <i className="fas fa-shopping-bag text-lg"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Need a portfolio?</h4>
                  <p className="text-sm text-gray-500">Get interview-ready with past questions & CV services</p>
                </div>
              </div>
              <Link href="/store" className="px-5 py-2 rounded-xl bg-[#22c55e] text-white text-sm font-medium hover:bg-[#16a34a] transition-colors">
                Visit Store
              </Link>
            </div>
          </div>
        )}

        {/* Applications Tab — Full CRUD */}
        {tab === 'applications' && (
          <div className="space-y-4">
            {/* Add button */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
              <button onClick={() => { setShowForm(true); setEditApp({}); }} className="px-4 py-2 rounded-xl bg-[#22c55e] text-white text-sm font-medium hover:bg-[#16a34a] transition-colors">
                <i className="fas fa-plus mr-1"></i>Add Application
              </button>
            </div>

            {/* Add/Edit form */}
            {showForm && (
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">New Application</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Job Title *</label>
                    <input
                      type="text" value={editApp?.title || ''}
                      onChange={(e) => setEditApp({ ...editApp, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]/40"
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Company *</label>
                    <input
                      type="text" value={editApp?.company || ''}
                      onChange={(e) => setEditApp({ ...editApp, company: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]/40"
                      placeholder="e.g. Tech Corp"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Status</label>
                    <select
                      value={editApp?.status || 'Submitted'}
                      onChange={(e) => setEditApp({ ...editApp, status: e.target.value as Application['status'] })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]/40"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Date Applied</label>
                    <input
                      type="date" value={editApp?.date || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setEditApp({ ...editApp, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]/40"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={addApplication} className="px-5 py-2 rounded-xl bg-[#22c55e] text-white text-sm font-medium hover:bg-[#16a34a] transition-colors">
                    <i className="fas fa-save mr-1"></i>Save
                  </button>
                  <button onClick={() => { setShowForm(false); setEditApp(null); }} className="px-5 py-2 rounded-xl bg-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-300 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Applications list */}
            {applications.length === 0 ? (
              <div className="text-center py-16">
                <i className="fas fa-inbox text-3xl text-gray-300 mb-3"></i>
                <p className="text-gray-400 text-sm">No applications yet. Start tracking!</p>
              </div>
            ) : (
              applications.map(app => (
                <div key={app.id} className="glass rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{app.title}</h4>
                    <p className="text-sm text-gray-500">{app.company} &middot; {app.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value as Application['status'])}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium border-0 focus:ring-2 focus:ring-[#22c55e]/40 cursor-pointer ${
                        app.status === 'Interview Scheduled' ? 'bg-[#22c55e]/10 text-[#22c55e]' :
                        app.status === 'Under Review' ? 'bg-amber-500/10 text-amber-600' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                        app.status === 'Offered' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => deleteApplication(app.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Saved Tab */}
        {tab === 'saved' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}</p>
            {savedJobs.length === 0 ? (
              <div className="text-center py-16">
                <i className="fas fa-heart text-3xl text-gray-300 mb-3"></i>
                <p className="text-gray-400 text-sm">No saved jobs yet. Browse and bookmark jobs to see them here!</p>
                <Link href="/browse" className="mt-3 inline-block px-5 py-2 rounded-xl bg-[#22c55e] text-white text-sm font-medium hover:bg-[#16a34a] transition-colors">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              savedJobs.map(job => (
                <div key={String(job.id)} className="glass rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={job.logo} alt={job.company} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-500">{job.company} &middot; {job.location || 'Nigeria'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => removeSavedJob(job.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Remove">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
