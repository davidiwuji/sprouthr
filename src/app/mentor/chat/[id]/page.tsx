'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/AppContext';
import { useParams } from 'next/navigation';

const aiMentors: Record<string, {
  id: string; name: string; title: string; color: string;
  expertise: string[]; bio: string; prompt: string;
  welcomeMessage: string;
}> = {
  'ai-1': {
    id: 'ai-1', name: 'AI Career Coach', title: 'Career Strategy & Planning',
    color: '#22c55e', expertise: ['CV Review', 'Career Path', 'Goal Setting'],
    bio: 'Your personal AI career strategist.',
    prompt: 'I need help planning my career path in tech.',
    welcomeMessage: 'Hi! I\'m your AI Career Coach. I can help you with career planning, skill development, job search strategies, and professional growth. What would you like to work on today?',
  },
  'ai-2': {
    id: 'ai-2', name: 'AI Interview Coach', title: 'Interview Preparation',
    color: '#3b82f6', expertise: ['Mock Interviews', 'Tech Interviews', 'Behavioral'],
    bio: 'Practice interviews anytime with AI.',
    prompt: 'Help me prepare for a job interview.',
    welcomeMessage: 'Welcome to Interview Prep! I\'ll help you practice and perfect your interview skills. Would you like a mock interview, or do you want tips on specific questions?',
  },
  'ai-3': {
    id: 'ai-3', name: 'AI Resume Expert', title: 'CV & Resume Review',
    color: '#f59e0b', expertise: ['Resume Writing', 'ATS Optimisation', 'Cover Letters'],
    bio: 'Get AI-powered CV suggestions.',
    prompt: 'Review my CV and tell me how to improve it.',
    welcomeMessage: 'Hi there! I\'m your Resume Expert. Paste your CV or describe your experience, and I\'ll help you optimise it for recruiters and ATS systems.',
  },
  'ai-4': {
    id: 'ai-4', name: 'AI Skills Advisor', title: 'Skill Development & Learning',
    color: '#8b5cf6', expertise: ['Tech Skills', 'Certifications', 'Learning Paths'],
    bio: 'Personalised learning recommendations.',
    prompt: 'What skills should I learn to become a data scientist?',
    welcomeMessage: 'Hey! I\'m your Skills Advisor. Tell me your dream role and I\'ll create a personalised learning roadmap with the most in-demand skills and certifications.',
  },
  'ai-5': {
    id: 'ai-5', name: 'AI Salary Negotiator', title: 'Salary & Offer Guidance',
    color: '#ef4444', expertise: ['Salary Negotiation', 'Offer Review', 'Market Rates'],
    bio: 'Data-driven salary insights.',
    prompt: 'How should I negotiate my salary offer?',
    welcomeMessage: 'Let\'s talk money! I\'m your Salary Negotiator. Share your offer details or target role and I\'ll give you market data and negotiation strategies for Nigeria\'s job market.',
  },
  'ai-6': {
    id: 'ai-6', name: 'AI Premium Mentor', title: 'Full Suite Career AI',
    color: '#0891b2', expertise: ['All-in-One', 'Personalised Coaching', 'Priority Support'],
    bio: 'The ultimate AI career companion.',
    prompt: 'I want comprehensive career guidance.',
    welcomeMessage: 'Welcome to Premium Mentorship! I\'m your all-in-one career AI. Whether it\'s interview prep, CV review, salary negotiation, or career strategy — I\'ve got you covered. What\'s your top priority today?',
  },
};

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function MentorChatPage() {
  const { navigateTo, showToast, state } = useApp();
  const params = useParams();
  const mentorId = params?.id as string;
  const mentor = aiMentors[mentorId];
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  // Redirect to mentor page if invalid ID
  useEffect(() => {
    if (!mentor) { navigateTo('/mentor'); return; }
    // Add welcome message
    setMessages([{ role: 'ai', text: mentor.welcomeMessage, timestamp: new Date() }]);
  }, [mentorId]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Login check — show prompt instead of redirecting away
  const needsLogin = !state.loading && !state.user;

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response (to be replaced with real AI)
    setTimeout(() => {
      const aiResponses: Record<string, string> = {
        'ai-1': 'Great question! Based on your interest in tech, I recommend starting with a skills assessment to identify your strengths. What area of tech are you most passionate about — software engineering, data science, product management, or something else?',
        'ai-2': 'Excellent! Let\'s start with a common question: "Tell me about yourself." Take a moment to structure your answer using the STAR method — Situation, Task, Action, Result. Go ahead and give it a try!',
        'ai-3': 'To give you the best CV advice, I need to understand your current situation. Are you a fresh graduate, an experienced professional looking to switch careers, or someone aiming for a promotion?',
        'ai-4': 'Great choice! The most in-demand skills in Nigeria right now include: data analysis (Python, SQL), cloud computing (AWS, Azure), digital marketing, UI/UX design, and cybersecurity. Which area interests you most?',
        'ai-5': 'Negotiation is key! First, research the market rate for your role in your location. In Nigeria, platforms like Jobberman and MyJobMag can help. What offer details can you share — role, industry, and proposed salary?',
        'ai-6': 'I\'m here to help with everything! Let\'s start with a quick assessment. What stage are you at in your career journey: (1) Exploring options, (2) Preparing to apply, (3) Active job search, or (4) Preparing for an offer?',
      };

      const aiMsg: ChatMessage = {
        role: 'ai',
        text: aiResponses[mentorId] || 'Thanks for your message! I\'m analysing your input and will provide personalised recommendations shortly. Feel free to share more details about your situation.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (!mentor) return null;

  return (
    <div className="page-transition min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigateTo('mentor')} className="text-gray-400 hover:text-gray-600 transition-colors">
            <i className="fas fa-arrow-left text-lg"></i>
          </button>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl" style={{ backgroundColor: mentor.color + '20' }}>
            <i className="fas fa-robot" style={{ color: mentor.color }}></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{mentor.name}</h1>
            <p className="text-sm text-gray-500">{mentor.title}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            {mentor.expertise.map(exp => (
              <span key={exp} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 hidden sm:inline">{exp}</span>
            ))}
          </div>
        </div>

        {/* Login Gate — shown inline instead of redirecting */}
        {needsLogin ? (
          <div className="glass rounded-3xl p-12 mb-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-lock text-2xl text-[#22c55e]"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in to Chat</h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Create an account or sign in to talk to {mentor.name} and get personalised career guidance.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigateTo('auth/login')} className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium text-sm hover:border-gray-300">
                <i className="fas fa-sign-in-alt mr-2"></i>Sign In
              </button>
              <button onClick={() => navigateTo('auth/signup')} className="px-6 py-3 rounded-xl accent-gradient text-white font-medium text-sm">
                <i className="fas fa-user-plus mr-2"></i>Create Account
              </button>
            </div>
          </div>
        ) : (
          <>

        {/* Chat Messages */}
        <div className="glass rounded-3xl p-6 mb-4 h-[60vh] overflow-y-auto flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === 'ai' ? 'bg-[#22c55e]/20' : 'bg-gray-200'
              }`}>
                <i className={`${msg.role === 'ai' ? 'fas fa-robot text-[#22c55e]' : 'fas fa-user text-gray-500'} text-xs`}></i>
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'ai'
                  ? 'bg-white rounded-tl-none shadow-sm border border-gray-100'
                  : 'bg-[#22c55e]/10 rounded-tr-none'
              }`}>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.text}</p>
                <p className="text-[10px] text-gray-400 mt-2">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${mentor.name} anything about ${mentor.title}...`}
            className="flex-1 px-5 py-3.5 bg-white rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none border border-gray-200 shadow-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3.5 rounded-2xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all disabled:opacity-50 shadow-sm"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>

        {/* Footer note */}
        <p className="text-xs text-gray-400 text-center mt-4">
          <i className="fas fa-info-circle mr-1"></i>
          AI responses are simulated. You'll be able to plug in your AI backend later.
        </p>
          </>
        )}
      </div>
    </div>
  );
}
