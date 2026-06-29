'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';

const aiMentors = [
  {
    id: 'ai-1',
    name: 'AI Career Coach',
    title: 'Career Strategy & Planning',
    expertise: ['CV Review', 'Career Path', 'Goal Setting'],
    bio: 'Your personal AI career strategist. Get instant advice on career planning, skill development, job search strategies, and professional growth — any time, any day.',
    rating: 4.9,
    sessions: '2,847',
    price: '₦2,500',
    color: '#22c55e',
    prompt: 'I need help planning my career path in tech. What steps should I take?',
  },
  {
    id: 'ai-2',
    name: 'AI Interview Coach',
    title: 'Interview Preparation',
    expertise: ['Mock Interviews', 'Tech Interviews', 'Behavioral'],
    bio: 'Practice interviews anytime with AI. Get real-time feedback on your answers, learn STAR method techniques, and build confidence for your dream job interview.',
    rating: 4.8,
    sessions: '5,123',
    price: '₦4,000',
    color: '#3b82f6',
    prompt: 'Help me prepare for a job interview. Ask me common interview questions.',
  },
  {
    id: 'ai-3',
    name: 'AI Resume Expert',
    title: 'CV & Resume Review',
    expertise: ['Resume Writing', 'ATS Optimisation', 'Cover Letters'],
    bio: 'Upload your CV or paste your experience and get instant AI-powered suggestions to make your application stand out to recruiters and pass ATS filters.',
    rating: 4.7,
    sessions: '3,956',
    price: '₦3,500',
    color: '#f59e0b',
    prompt: 'Review my CV and tell me how to improve it for tech jobs.',
  },
  {
    id: 'ai-4',
    name: 'AI Skills Advisor',
    title: 'Skill Development & Learning',
    expertise: ['Tech Skills', 'Certifications', 'Learning Paths'],
    bio: 'Discover which skills are in demand for your dream role. Get personalised learning recommendations, certification guidance, and a roadmap to upskill.',
    rating: 4.8,
    sessions: '1,892',
    price: '₦3,000',
    color: '#8b5cf6',
    prompt: 'What skills should I learn to become a data scientist in Nigeria?',
  },
  {
    id: 'ai-5',
    name: 'AI Salary Negotiator',
    title: 'Salary & Offer Guidance',
    expertise: ['Salary Negotiation', 'Offer Review', 'Market Rates'],
    bio: 'Get data-driven salary insights for Nigerian roles. Learn negotiation tactics, understand market rates, and practise your salary conversations with confidence.',
    rating: 4.6,
    sessions: '1,245',
    price: '₦2,500',
    color: '#ef4444',
    prompt: 'How should I negotiate my salary offer for a role in Lagos?',
  },
  {
    id: 'ai-6',
    name: 'AI Premium Mentor',
    title: 'Full Suite Career AI',
    expertise: ['All-in-One', 'Personalised Coaching', 'Priority Support'],
    bio: 'The ultimate AI career companion. Get everything — interview coaching, CV review, skills advice, salary negotiation, and industry insights all in one premium experience.',
    rating: 4.9,
    sessions: '892',
    price: '₦8,000',
    color: '#0891b2',
    prompt: 'I want comprehensive career guidance. Help me with my entire job search strategy.',
  },
];

export default function MentorPage() {
  const { navigateTo, showToast, state } = useApp();
  const [search, setSearch] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({ name: '', email: '', phone: '', expertise: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const filtered = aiMentors.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.expertise.some(e => e.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAIChat = (mentor: typeof aiMentors[0]) => {
    navigateTo(`mentor/chat/ai-2?mentor=${mentor.id}`);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.user) {
      showToast('Please sign in to request a human mentor', 'info');
      navigateTo('auth/signup');
      return;
    }
    setSubmitting(true);
    // Simulate submission
    await new Promise(r => setTimeout(r, 1500));
    showToast('Your request has been submitted! We will match you with a mentor soon.', 'success');
    setRequestForm({ name: '', email: '', phone: '', expertise: '', message: '' });
    setShowRequestForm(false);
    setSubmitting(false);
  };

  return (
    <div className="page-transition min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#22c55e]/10 text-[#22c55e] text-xs font-medium mb-4">
            <i className="fas fa-robot"></i> AI-Powered Career Guidance
          </div>
          <h1 className="text-4xl font-bold text-gray-900 font-space mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            AI <span className="text-[#22c55e]">Mentors</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Get instant career advice from AI-powered mentors — available 24/7, starting from ₦2,500. 
            Our AI mentors are trained on Nigerian job market data and career best practices.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-10">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search AI mentors by name or expertise..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none border border-gray-200 shadow-sm"
          />
        </div>

        {/* AI Mentor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filtered.map(mentor => (
            <div key={mentor.id} className="glass rounded-2xl p-6 card-hover relative group">
              <div className="absolute top-4 right-4">
                <span className="text-xs px-3 py-1 rounded-full font-medium bg-[#22c55e]/10 text-[#22c55e] flex items-center gap-1">
                  <i className="fas fa-microchip text-[10px]"></i> AI
                </span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: mentor.color + '20' }}>
                  <i className="fas fa-robot" style={{ color: mentor.color }}></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                  <p className="text-sm text-gray-500">{mentor.title}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">{mentor.bio}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {mentor.expertise.map(exp => (
                  <span key={exp} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{exp}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-yellow-500"><i className="fas fa-star mr-1"></i>{mentor.rating} ({mentor.sessions} sessions)</span>
                <span className="font-bold text-[#22c55e]">{mentor.price}</span>
              </div>
              <button
                onClick={() => handleAIChat(mentor)}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-all bg-gray-900 text-white hover:bg-gray-800 shadow-sm flex items-center justify-center gap-2"
              >
                <i className="fas fa-comment-dots"></i>
                Chat with AI Mentor
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center mb-16">
            <i className="fas fa-robot text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No AI mentors found</h3>
            <p className="text-gray-500">Try a different search term</p>
          </div>
        )}

        {/* Request Human Mentor Section */}
        <div className="border-t border-gray-200 pt-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium mb-4">
              <i className="fas fa-user-tie"></i> Human Mentorship
            </div>
            <h2 className="text-3xl font-bold text-gray-900 font-space mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Need a <span className="text-purple-600">Human Mentor</span>?
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Our AI mentors handle most questions instantly, but if you need personalised guidance from an experienced professional, submit a request below.
            </p>
          </div>

          {!showRequestForm ? (
            <div className="text-center">
              <button
                onClick={() => {
                  if (!state.user) {
                    showToast('Please sign in to request a mentor', 'info');
                    navigateTo('auth/signup');
                    return;
                  }
                  setShowRequestForm(true);
                }}
                className="px-8 py-4 rounded-2xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-500/25"
              >
                <i className="fas fa-hand-paper mr-2"></i>
                Request a Human Mentor
              </button>
              <p className="text-xs text-gray-400 mt-3">
                Limited availability — we personally match you with the right mentor for your needs.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRequestSubmit} className="max-w-lg mx-auto glass rounded-3xl p-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={requestForm.name} onChange={e => setRequestForm(p => ({ ...p, name: e.target.value }))} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:outline-none focus:border-purple-500" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={requestForm.email} onChange={e => setRequestForm(p => ({ ...p, email: e.target.value }))} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:outline-none focus:border-purple-500" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                  <input type="tel" value={requestForm.phone} onChange={e => setRequestForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:outline-none focus:border-purple-500" placeholder="+234 800 000 0000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area of Expertise Needed</label>
                  <select value={requestForm.expertise} onChange={e => setRequestForm(p => ({ ...p, expertise: e.target.value }))} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:outline-none focus:border-purple-500">
                    <option value="">Select an area...</option>
                    <option value="software-engineering">Software Engineering</option>
                    <option value="product-management">Product Management</option>
                    <option value="data-science">Data Science / AI</option>
                    <option value="finance">Finance / Investment Banking</option>
                    <option value="career-coaching">Career Coaching / CV Review</option>
                    <option value="entrepreneurship">Entrepreneurship</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tell us about your goals</label>
                  <textarea value={requestForm.message} onChange={e => setRequestForm(p => ({ ...p, message: e.target.value }))} required rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:outline-none focus:border-purple-500" placeholder="What do you hope to achieve with a mentor? What specific challenges are you facing?"></textarea>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all disabled:opacity-50">
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button type="button" onClick={() => setShowRequestForm(false)} className="px-6 py-3 rounded-xl bg-gray-100 text-gray-500 font-medium hover:bg-gray-200 transition-all">
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: 'fa-robot', label: 'AI Mentors', value: '6' },
            { icon: 'fa-clock', label: 'Availability', value: '24/7' },
            { icon: 'fa-users', label: 'Active Users', value: '1,284' },
            { icon: 'fa-comments', label: 'AI Sessions Today', value: '342' },
          ].map(s => (
            <div key={s.label} className="text-center p-6 glass rounded-2xl">
              <i className={`fas ${s.icon} text-2xl text-[#22c55e] mb-2`}></i>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
