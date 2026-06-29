'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import AdBanner from '@/components/AdBanner';

export default function SignUpPage() {
  const { showToast, state } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!state.loading && state.user) {
      router.replace('/dashboard');
    }
  }, [state.user, state.loading, router]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    telegram: '',
    password: '',
    confirmPassword: '',
    role: 'jobseeker',
    agreeTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setForm(prev => ({ ...prev, [target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim()) { showToast('Please enter your full name', 'error'); return; }
    if (!form.email.trim()) { showToast('Please enter your email', 'error'); return; }
    if (!form.phone.trim()) { showToast('Please enter your phone number', 'error'); return; }
    if (!form.location.trim()) { showToast('Please enter your location', 'error'); return; }
    if (form.password.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
    if (form.password !== form.confirmPassword) { showToast('Passwords do not match', 'error'); return; }
    if (!form.agreeTerms) { showToast('Please agree to the Terms & Conditions', 'error'); return; }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            phone: form.phone,
            location: form.location,
            telegram: form.telegram,
            role: form.role,
          },
        },
      });

      if (error) {
        showToast(error.message, 'error');
        setLoading(false);
        return;
      }

      showToast('Account created! Check your email to verify.', 'success');
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      showToast('An unexpected error occurred', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="page-transition min-h-screen flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#22c55e] flex items-center justify-center">
              <i className="fas fa-seedling text-white"></i>
            </div>
            <span className="text-2xl font-bold font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              SPROUT<span className="text-[#22c55e]">HR</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-2">Join thousands of professionals on SPROUTHR</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" required className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@email.com" required className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+234 801 234 5678" required className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="Lagos, Nigeria" required className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Telegram Username <span className="text-gray-400 font-normal">(optional)</span></label>
              <input name="telegram" value={form.telegram} onChange={handleChange} placeholder="@yourusername" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 chars" required minLength={6} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat" required minLength={6} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a</label>
              <select name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-[#22c55e] transition-colors">
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer / Recruiter</option>
              </select>
            </div>
            <div className="flex items-start gap-3">
              <input name="agreeTerms" type="checkbox" checked={form.agreeTerms} onChange={handleChange} className="mt-1 w-4 h-4 rounded border-gray-200 bg-white accent-[#22c55e]" />
              <label className="text-sm text-gray-500">I agree to the <Link href="/terms" className="text-[#22c55e] hover:underline">Terms</Link> & <Link href="/privacy" className="text-[#22c55e] hover:underline">Privacy Policy</Link></label>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl accent-gradient text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Creating...</> : <><i className="fas fa-user-plus"></i> Create Account</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Already have an account? <Link href="/auth/login" className="text-[#22c55e] font-medium hover:underline">Sign in</Link></p>
          </div>
        </div>

        {/* Heavy ads inside signup page */}
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
