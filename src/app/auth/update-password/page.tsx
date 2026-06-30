'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useApp } from '@/lib/AppContext';
import AdBanner from '@/components/AdBanner';

export default function UpdatePasswordPage() {
  const { showToast } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [done, setDone] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [form, setForm] = useState({ password: '', confirmPassword: '' });

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setHasSession(true);
      } else {
        // No session — maybe the code exchange didn't happen.
        // Check URL for auth code (PKCE) and try to exchange it
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) {
            setHasSession(true);
          }
        }
      }
      setChecking(false);
    };
    checkSession();
  }, []);

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
        if (error.message?.toLowerCase().includes('session')) {
          showToast('Session expired. Please request a new reset link.', 'error');
          setTimeout(() => router.push('/auth/login'), 2000);
        } else {
          showToast(error.message, 'error');
        }
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

  if (checking) {
    return (
      <div className="page-transition min-h-screen flex items-center justify-center bg-[#f0f2f5]">
        <div className="flex flex-col items-center gap-4">
          <img src="/Logo.png" alt="SproutHR" className="h-16 w-auto animate-pulse" />
          <span className="text-sm text-gray-400">Checking session...</span>
        </div>
      </div>
    );
  }

  if (!hasSession && !done) {
    return (
      <div className="page-transition min-h-screen flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid or Expired Link</h1>
          <p className="text-gray-500 mb-6">This password reset link is invalid or has expired. Please request a new one.</p>
          <Link href="/auth/login"
            className="inline-block w-full py-3.5 rounded-xl accent-gradient text-white font-semibold hover:opacity-90 text-center">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition min-h-screen flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <img src="/Logo.png" alt="SproutHR" className="h-20 w-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="text-gray-500 mt-2">
            {done ? 'All set!' : 'Choose a strong password you haven\'t used before.'}
          </p>
        </div>

        <div className="glass rounded-2xl p-8">
          {done ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#22c55e]/20 flex items-center justify-center mx-auto">
                <i className="fas fa-check-circle text-[#22c55e] text-2xl"></i>
              </div>
              <p className="text-sm text-gray-500">Your password has been updated successfully.</p>
              <Link href="/auth/login"
                className="inline-block w-full py-3.5 rounded-xl accent-gradient text-white font-semibold hover:opacity-90 text-center">
                Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <input name="password" type="password" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Minimum 6 characters" required minLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword}
                  onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Repeat your password" required minLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl accent-gradient text-white font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Updating...</> : <><i className="fas fa-key"></i> Update Password</>}
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
