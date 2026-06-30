'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import AdBanner from '@/components/AdBanner';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Federal Capital Territory', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano',
  'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger',
  'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara',
];

const COUNTRIES = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'United Kingdom',
  'United States', 'Canada', 'Germany', 'France', 'Netherlands',
  'Australia', 'India', 'United Arab Emirates', 'Saudi Arabia',
  'Rwanda', 'Ethiopia', 'Uganda', 'Tanzania', 'Egypt', 'Morocco',
];

const CAREER_FIELDS = [
  'Accounting / Finance', 'Administration / Office', 'Agriculture / Agro-Allied',
  'Architecture / Urban Planning', 'Arts / Entertainment / Media',
  'Aviation / Aerospace', 'Banking / Finance / Insurance',
  'Construction / Building', 'Consulting / Strategy', 'Customer Service',
  'Education / Teaching / Training', 'Engineering (Civil)',
  'Engineering (Electrical/Electronics)', 'Engineering (Mechanical)',
  'Engineering (Petroleum/Gas)', 'Engineering (Software/IT)',
  'Environment / Sustainability', 'Fashion / Beauty',
  'Food Services / Hospitality', 'Government / Civil Service',
  'Graphics / Design / Creative', 'Health / Medical / Pharmaceutical',
  'Human Resources / Recruitment', 'Information Technology',
  'Journalism / Writing / Content', 'Law / Legal Services',
  'Logistics / Supply Chain / Transport', 'Manufacturing / Production',
  'Marketing / Advertising / PR', 'Military / Paramilitary / Security',
  'Mining / Oil & Gas', 'NGO / Non-profit / Social Work',
  'Oil & Gas / Energy', 'Operations / Management',
  'Pharmaceutical / Healthcare', 'Police / Customs / Immigration',
  'Real Estate / Property', 'Research / Data Analysis',
  'Retail / Sales', 'Sales / Business Development',
  'Science / Research / Lab', 'Security / Intelligence',
  'Social Media / Digital Marketing', 'Sports / Recreation',
  'Surveying / Geoinformatics', 'Tech / Software Development',
  'Telecommunications', 'Trades / Skilled Labour',
  'Training / Capacity Building', 'Transportation / Logistics',
  'Veterinary / Animal Science', 'Web / Mobile Development',
  'Others',
];

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
    country: 'Nigeria',
    state: '',
    careerField: '',
    telegram: '',
    linkedin: '',
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
    if (!form.country) { showToast('Please select your country', 'error'); return; }
    if (form.country === 'Nigeria' && !form.state) { showToast('Please select your state', 'error'); return; }
    if (!form.careerField) { showToast('Please select your career field', 'error'); return; }
    if (form.password.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
    if (form.password !== form.confirmPassword) { showToast('Passwords do not match', 'error'); return; }
    if (!form.agreeTerms) { showToast('Please agree to the Terms & Conditions', 'error'); return; }

    setLoading(true);

    try {
      const supabase = createClient();
      const locationStr = form.country === 'Nigeria' && form.state
        ? `${form.state}, ${form.country}`
        : form.country;

      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: form.fullName,
            phone: form.phone,
            location: locationStr,
            country: form.country,
            state: form.state,
            career_field: form.careerField,
            telegram: form.telegram,
            linkedin: form.linkedin,
            role: form.role,
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('already') || error.message.toLowerCase().includes('exists')) {
          showToast('This email is already registered. Please sign in.', 'error');
        } else {
          showToast(error.message, 'error');
        }
        setLoading(false);
        return;
      }

      showToast('Account created! Check your email for the confirmation link, then sign in.', 'success');
      setTimeout(() => router.push('/auth/login'), 3000);
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
            <img src="/Logo.png" alt="SproutHR" className="h-20 w-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-2">Join thousands of professionals on SproutHR</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" required className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@email.com" required className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+234 801 234 5678" required className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
            </div>

            {/* Country + State row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                <select name="country" value={form.country} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-[#22c55e] transition-colors">
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                <select name="state" value={form.state} onChange={handleChange} disabled={form.country !== 'Nigeria'} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-[#22c55e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <option value="">{form.country === 'Nigeria' ? 'Select state' : 'N/A'}</option>
                  {form.country === 'Nigeria' && NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Career Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Career Field</label>
              <select name="careerField" value={form.careerField} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-[#22c55e] transition-colors">
                <option value="">Select your field</option>
                {CAREER_FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Telegram */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Telegram Username <span className="text-gray-400 font-normal">(optional)</span></label>
              <input name="telegram" value={form.telegram} onChange={handleChange} placeholder="@yourusername" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
            </div>

            {/* LinkedIn (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn Profile URL <span className="text-gray-400 font-normal">(optional)</span></label>
              <input name="linkedin" type="url" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourprofile" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors" />
            </div>

            {/* Password + Confirm */}
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

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a</label>
              <select name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-[#22c55e] transition-colors">
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer / Recruiter</option>
              </select>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input name="agreeTerms" type="checkbox" checked={form.agreeTerms} onChange={handleChange} className="mt-1 w-4 h-4 rounded border-gray-200 bg-white accent-[#22c55e]" />
              <label className="text-sm text-gray-500">I agree to the <Link href="/terms" className="text-[#22c55e] hover:underline">Terms</Link> & <Link href="/privacy" className="text-[#22c55e] hover:underline">Privacy Policy</Link></label>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl accent-gradient text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Creating...</> : <><i className="fas fa-user-plus"></i> Create Account</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Already have an account? <Link href="/auth/login" className="text-[#22c55e] font-medium hover:underline">Sign in</Link></p>
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
