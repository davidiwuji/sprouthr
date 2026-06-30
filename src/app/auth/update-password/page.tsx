'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useApp } from '@/lib/AppContext';
import AdBanner from '@/components/AdBanner';

export default function UpdatePasswordPage() {
  const { showToast } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ password: '', confirmPassword: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (form.password !== form.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: form.password });
      if (error) {
        showToast(error.message, 'error');
        setLoading(false);
        return;
      }
      setDone(true);
      showToast('Password updated! You can now sign in.', 'success');
    } catch {
      showToast('Connection error. Try again.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="page-transition min-h-screen flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <img src="/Logo.png" alt="SproutHR" className="h-20 w-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Update Password</h1>
          <p className="text-gray-500 mt-2">
            {done ? 'All set!' : 'Enter your new password below.'}
          </p>
        </div>

        <div className="glass rounded-2xl p-8">
          {done ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#22c55e]/20 flex items-center justify-center mx-auto">
                <i className="fas fa-check-circle text-[#22c55e] text-2xl"></i>
              </div>
              <p className="text-sm text-gray-500">Your password has been updated.</p>
              <Link href="/auth/login"
                className="inline-block w-full py-3.5 rounded-xl accent-gradient text-white font-semibold hover:opacity-90 text-center">
                Go to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <input name="password" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Min 6 characters" required minLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Repeat password" required minLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl accent-gradient text-white font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Updating...</> : 'Update Password'}
              </button>
            </form>
          )}
        </div>

        <div className="mt-8">
          <AdBanner variant="horizontal" />
        </div>
      </div>
    </div>
  );
}
