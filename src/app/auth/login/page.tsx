'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import AdBanner from '@/components/AdBanner';

export default function LoginPage() {
  const { showToast, refreshSession, state } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    if (!state.loading && state.user) {
      router.replace('/dashboard');
    }
  }, [state.user, state.loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) {
        const msg = error.message?.toLowerCase() || '';
        if (msg.includes('invalid login credentials')) {
          showToast('Invalid email or password', 'error');
        } else if (msg.includes('email not confirmed')) {
          showToast('Please check your inbox and click the confirmation link before signing in.', 'warning');
        } else {
          showToast(error.message, 'error');
        }
        setLoading(false);
        return;
      }
      showToast('Signed in successfully!', 'success');
      await refreshSession();
      router.push('/dashboard');
    } catch (err: any) {
      showToast('Connection error. Please try again or check your internet.', 'error');
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) { showToast('Enter your email', 'error'); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) {
        showToast(error.message, 'error');
      } else {
        setResetSent(true);
        showToast('Password reset link sent! Check your email.', 'success');
      }
    } catch (err) {
      showToast('Connection error. Please try again.', 'error');
    }
    setLoading(false);
  };

  if (showReset) {
    return (
      <div className="page-transition min-h-screen flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center mb-6">
              <img src="/Logo.png" alt="SproutHR" className="h-20 w-auto" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-gray-500 mt-2">
              {resetSent ? 'Check your email for the reset link.' : 'Enter your email to receive a reset link.'}
            </p>
          </div>

          <div className="glass rounded-2xl p-8">
            {resetSent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#22c55e]/20 flex items-center justify-center mx-auto">
                  <i className="fas fa-envelope text-[#22c55e] text-2xl"></i>
                </div>
                <p className="text-sm text-gray-500">
                  We&apos;ve sent a password reset link to <strong>{resetEmail}</strong>.<br />
                  Check your inbox (and spam folder).
                </p>
                <button onClick={() => { setShowReset(false); setResetSent(false); setResetEmail(''); }}
                  className="text-sm text-[#22c55e] font-medium hover:underline">
                  Back to sign in
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                    placeholder="john@email.com" required
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] transition-colors" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl accent-gradient text-white font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><i className="fas fa-spinner fa-spin"></i> Sending...</> : 'Send Reset Link'}
                </button>
                <div className="text-center">
                  <button type="button" onClick={() => setShowReset(false)}
                    className="text-sm text-gray-400 hover:text-gray-600">
                    Back to sign in
                  </button>
                </div>
              </form>
            )}
          </div>
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
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-2">Sign in to your SproutHR account</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="john@email.com" required
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <button type="button" onClick={() => setShowReset(true)}
                  className="text-xs text-[#22c55e] hover:underline font-medium">
                  Forgot?
                </button>
              </div>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                placeholder="Enter your password" required
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl accent-gradient text-white font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Signing in...</> : <><i className="fas fa-sign-in-alt"></i> Sign In</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-[#22c55e] font-medium hover:underline">Create one</Link>
            </p>
          </div>
        </div>

        {/* Ads */}
        <div className="mt-8">
          <AdBanner variant="horizontal" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <AdBanner variant="box" />
          <AdBanner variant="box" />
        </div>
      </div>
    </div>
  );
}
