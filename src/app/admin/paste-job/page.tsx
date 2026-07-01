'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/lib/AppContext';
import { createClient } from '@/utils/supabase/client';

const SUPER_ADMIN_EMAIL = 'davidiwuji1@gmail.com';

interface ParsedJob {
  title: string;
  company: string;
  description: string;
  salary: string;
  location: string;
  type: string;
  category: string;
  deadline: string | null;
  experience_level: string;
  workplace_type: string;
  url: string;
}

const emptyParsed: ParsedJob = {
  title: '', company: '', description: '', salary: '',
  location: '', type: 'Full Time', category: 'job',
  deadline: null, experience_level: 'entry', workplace_type: '', url: '',
};

export default function PasteJobPage() {
  const { state, showToast, navigateTo } = useApp();
  const user = state.user;
  const isAdmin = user?.email === SUPER_ADMIN_EMAIL;

  const [rawText, setRawText] = useState('');
  const [parsed, setParsed] = useState<ParsedJob>({ ...emptyParsed });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rawOutput, setRawOutput] = useState('');
  const [error, setError] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleParse = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    setError('');
    setRawOutput('');
    try {
      const res = await fetch('/api/admin/paste-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Parse failed');
        return;
      }
      setParsed(data.parsed);
      setEditing(true);
      setRawOutput(data.raw || '');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!parsed.title || !parsed.company) {
      showToast?.({ message: 'Title and Company are required', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from('jobs').insert({
        title: parsed.title,
        company: parsed.company,
        description: parsed.description,
        salary: parsed.salary || null,
        location: parsed.location || null,
        type: parsed.type || 'Full Time',
        category: parsed.category || 'job',
        date_posted: new Date().toISOString(),
        deadline: parsed.deadline || null,
        experience_level: parsed.experience_level || 'entry',
        workplace_type: parsed.workplace_type || null,
        url: parsed.url || null,
        source: 'admin_paste',
        external_id: `admin_${Date.now()}`,
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      showToast?.({ message: 'Job posted successfully!', type: 'success' });
      setRawText('');
      setParsed({ ...emptyParsed });
      setEditing(false);
      setRawOutput('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof ParsedJob, value: any) => {
    setParsed(prev => ({ ...prev, [field]: value }));
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
          <p className="text-gray-500">Only the admin can access this page.</p>
          <button onClick={() => navigateTo?.('/')} className="mt-4 text-[#22c55e] hover:underline">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paste Job from WhatsApp</h1>
            <p className="text-gray-500 text-sm mt-1">AI parses raw text into structured job data</p>
          </div>
          <button onClick={() => navigateTo?.('/admin')} className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">
            &larr; Back to Admin
          </button>
        </div>

        {!editing && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Paste the WhatsApp message here:</label>
            <textarea
              ref={textareaRef}
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="Paste a job post from WhatsApp, Telegram, Twitter, or anywhere..."
              className="w-full h-64 p-4 border border-gray-200 rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-[#22c55e]/30 focus:border-[#22c55e] font-mono text-sm"
            />
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleParse}
                disabled={loading || !rawText.trim()}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  loading || !rawText.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#22c55e] text-white hover:bg-[#1da94f]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Parsing...
                  </span>
                ) : 'Parse with AI'}
              </button>
              {rawText && (
                <button onClick={() => { setRawText(''); setError(''); }} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
                  Clear
                </button>
              )}
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
            )}
          </div>
        )}

        {editing && (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Review &amp; Edit</h2>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(false); setRawOutput(''); }} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg transition-colors">
                    &larr; Edit Raw Text
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`px-5 py-1.5 rounded-lg font-semibold text-sm transition-all ${
                      saving ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#22c55e] text-white hover:bg-[#1da94f]'
                    }`}
                  >
                    {saving ? 'Saving...' : 'Save to Database'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Title" value={parsed.title} onChange={v => updateField('title', v)} required />
                <Field label="Company" value={parsed.company} onChange={v => updateField('company', v)} required />
                <Field label="Location" value={parsed.location || ''} onChange={v => updateField('location', v)} />
                <Field label="Salary" value={parsed.salary || ''} onChange={v => updateField('salary', v)} />
                <SelectField label="Type" value={parsed.type} onChange={v => updateField('type', v)} options={[
                  'Full Time', 'Part Time', 'Contract', 'Remote', 'Internship', 'Graduate Program', 'Freelance'
                ]} />
                <SelectField label="Category" value={parsed.category} onChange={v => updateField('category', v)} options={[
                  { value: 'job', label: 'Job' },
                  { value: 'internship', label: 'Internship' },
                  { value: 'scholarship', label: 'Scholarship' },
                  { value: 'fellowship', label: 'Fellowship' },
                  { value: 'graduate', label: 'Graduate Program' },
                  { value: 'bootcamp', label: 'Bootcamp' },
                  { value: 'grant', label: 'Grant' },
                  { value: 'volunteer', label: 'Volunteer' },
                ]} />
                <SelectField label="Experience" value={parsed.experience_level} onChange={v => updateField('experience_level', v)} options={[
                  { value: 'entry', label: 'Entry Level' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'senior', label: 'Senior' },
                  { value: 'lead', label: 'Lead' },
                  { value: 'all', label: 'All Levels' },
                ]} />
                <SelectField label="Workplace" value={parsed.workplace_type || ''} onChange={v => updateField('workplace_type', v)} options={[
                  { value: '', label: 'Not specified' },
                  { value: 'remote', label: 'Remote' },
                  { value: 'hybrid', label: 'Hybrid' },
                  { value: 'onsite', label: 'On-site' },
                ]} />
                <Field label="Deadline (YYYY-MM-DD)" value={parsed.deadline || ''} onChange={v => updateField('deadline', v || null)} />
                <Field label="Apply URL" value={parsed.url || ''} onChange={v => updateField('url', v)} />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={parsed.description}
                  onChange={e => updateField('description', e.target.value)}
                  className="w-full h-48 p-3 border border-gray-200 rounded-xl resize-y text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]/30"
                />
              </div>
            </div>

            {rawOutput && (
              <details className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 font-medium">View raw AI response</summary>
                <pre className="mt-2 p-3 bg-gray-50 rounded-xl text-xs text-gray-600 overflow-auto max-h-48 whitespace-pre-wrap">{rawOutput}</pre>
              </details>
            )}
          </>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">How to use:</h3>
          <ol className="text-sm text-gray-500 space-y-2 list-decimal list-inside">
            <li>Copy a job post from WhatsApp, Telegram, Twitter, or any channel</li>
            <li>Paste it in the text area above</li>
            <li>Click <strong className="text-[#22c55e]">Parse with AI</strong> &mdash; Groq extracts all fields</li>
            <li>Review and edit any fields that need correction</li>
            <li>Click <strong className="text-[#22c55e]">Save to Database</strong> &mdash; job goes live on the site</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]/30 focus:border-[#22c55e] ${required && !value ? 'border-red-200 bg-red-50' : ''}`}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: (string | { value: string; label: string })[];
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]/30 focus:border-[#22c55e] bg-white"
      >
        {options.map(opt => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const lbl = typeof opt === 'string' ? opt : opt.label;
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </select>
    </div>
  );
}
