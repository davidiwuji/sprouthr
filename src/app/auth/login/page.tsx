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
  const [form, setForm] = useState({ email: '', password: '' });

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
      const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) {
        if (error.message?.toLowerCase().includes('invalid login credentials')) {
          showToast('Invalid email or password', 'error');
        } else if (error.message?.toLowerCase().includes('email not confirmed')) {
          showToast('Please verify your email before signing in', 'error');
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
      showToast('Cannot reach authentication server. Check your internet or try again later.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="page-transition min-h-screen flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/Logo.png" alt="SproutHR" className="h-12 w-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-2">Sign in to your SproutHR account</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@email.com" required className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" required className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl accent-gradient text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Signing in...</> : <><i className="fas fa-sign-in-alt"></i> Sign In</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Don&apos;t have an account? <Link href="/auth/signup" className="text-[#22c55e] font-medium hover:underline">Create one</Link></p>
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
