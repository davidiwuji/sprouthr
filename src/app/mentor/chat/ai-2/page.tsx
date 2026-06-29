'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/AppContext';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Message {
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const mentorProfiles: Record<string, {
  id: string; name: string; title: string; color: string;
  expertise: string[]; icon: string;
  welcomeMessage: string;
}> = {
  'ai-1': {
    id: 'ai-1', name: 'AI Career Coach', title: 'Career Strategy & Planning',
    color: '#22c55e', expertise: ['CV Review', 'Career Path', 'Goal Setting'], icon: 'fa-compass',
    welcomeMessage: "Hi! I'm your AI Career Coach. I can help you with career planning, skill development, job search strategies, and professional growth. What would you like to work on today?",
  },
  'ai-2': {
    id: 'ai-2', name: 'AI Interview Coach', title: 'Interview Preparation',
    color: '#3b82f6', expertise: ['Mock Interviews', 'Tech Interviews', 'Behavioral'], icon: 'fa-comments',
    welcomeMessage: "Welcome to Interview Prep! I'll help you practice and perfect your interview skills. Would you like a mock interview, or do you want tips on specific questions?",
  },
  'ai-3': {
    id: 'ai-3', name: 'AI Resume Expert', title: 'CV & Resume Review',
    color: '#f59e0b', expertise: ['Resume Writing', 'ATS Optimisation', 'Cover Letters'], icon: 'fa-file-pen',
    welcomeMessage: "Hi! I'm your AI Resume Expert. I can help with CV writing, ATS optimisation, cover letters, and making your application stand out. What would you like me to review?",
  },
  'ai-4': {
    id: 'ai-4', name: 'AI Skills Advisor', title: 'Skill Development & Learning',
    color: '#8b5cf6', expertise: ['Tech Skills', 'Certifications', 'Learning Paths'], icon: 'fa-graduation-cap',
    welcomeMessage: "Hey! I'm your AI Skills Advisor. I can help you discover in-demand skills, find certifications, and create a learning roadmap for your dream career. What interests you?",
  },
  'ai-5': {
    id: 'ai-5', name: 'AI Salary Negotiator', title: 'Salary & Offer Guidance',
    color: '#ef4444', expertise: ['Salary Negotiation', 'Offer Review', 'Market Rates'], icon: 'fa-coins',
    welcomeMessage: "Hi there! I specialise in salary negotiation and job offers. Whether you're preparing for a negotiation or reviewing an offer, I'm here to help. What's your situation?",
  },
  'ai-6': {
    id: 'ai-6', name: 'AI Premium Mentor', title: 'Full Suite Career AI',
    color: '#a855f7', expertise: ['All-in-One', 'Personalised Coaching', 'Priority Support'], icon: 'fa-crown',
    welcomeMessage: "Welcome to Premium! I'm your all-in-one career AI companion. I can help with interviews, CVs, career planning, skills, salary — anything career-related. What would you like to explore?",
  },
};

export default function AIChatPage() {
  const { state } = useApp();
  const searchParams = useSearchParams();
  const mentorId = searchParams.get('mentor') || 'ai-1';
  const mentor = mentorProfiles[mentorId] || mentorProfiles['ai-1'];

  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: mentor.welcomeMessage, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMentorMenu, setShowMentorMenu] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Reset messages when mentor changes
  useEffect(() => {
    setMessages([{ role: 'ai', text: mentor.welcomeMessage, timestamp: new Date() }]);
    setInput('');
  }, [mentorId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const switchMentor = (id: string) => {
    window.history.replaceState(null, '', `?mentor=${id}`);
    setShowMentorMenu(false);
    setMessages([{ role: 'ai', text: mentorProfiles[id].welcomeMessage, timestamp: new Date() }]);
    setInput('');
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.slice(-10); // last 10 messages for context
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentorId, message: text, history }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API error');

      const aiMsg: Message = { role: 'ai', text: data.reply, timestamp: new Date() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        role: 'ai',
        text: 'Sorry, I encountered an error. Please try again in a moment.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="page-transition min-h-screen pt-20 pb-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-100px)] flex flex-col">
        {/* Header with mentor info + switcher */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: mentor.color + '20' }}>
              <i className={`fas ${mentor.icon} text-sm`} style={{ color: mentor.color }}></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900">{mentor.name}</h1>
                <div className="relative">
                  <button onClick={() => setShowMentorMenu(!showMentorMenu)} className="text-gray-400 hover:text-gray-600 text-xs">
                    <i className="fas fa-chevron-down"></i>
                  </button>
                  {showMentorMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 w-56 z-50" onMouseLeave={() => setShowMentorMenu(false)}>
                      {Object.values(mentorProfiles).map(m => (
                        <button key={m.id} onClick={() => switchMentor(m.id)} className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-gray-50 ${m.id === mentorId ? 'bg-[#22c55e]/5 text-[#22c55e] font-medium' : 'text-gray-700'}`}>
                          <i className={`fas ${m.icon}`} style={{ color: m.color }}></i>
                          <div><p className="font-medium">{m.name}</p><p className="text-xs text-gray-400">{m.title}</p></div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400">{mentor.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex gap-1">
              {mentor.expertise.map(exp => (
                <span key={exp} className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-500">{exp}</span>
              ))}
            </div>
            <Link href="/mentor" className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all">
              <i className="fas fa-arrow-left mr-1"></i> Mentors
            </Link>
            <button onClick={() => setMessages([{ role: 'ai', text: mentor.welcomeMessage, timestamp: new Date() }])} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all">
              <i className="fas fa-rotate mr-1"></i> New Chat
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${msg.role === 'ai' ? 'text-white' : 'bg-gray-100 text-gray-500'}`} style={msg.role === 'ai' ? { backgroundColor: mentor.color + '20', color: mentor.color } : {}}>
                  <i className={`fas ${msg.role === 'ai' ? mentor.icon : 'fa-user'} text-xs`}></i>
                </div>
                <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'ai' 
                    ? 'bg-gray-50 text-gray-700 border border-gray-100' 
                    : 'text-white'
                }`} style={msg.role === 'ai' ? {} : { background: `linear-gradient(135deg, ${mentor.color}, ${mentor.color}dd)` }}>
                  {msg.text}
                  <div className={`text-xs mt-2 ${msg.role === 'ai' ? 'text-gray-400' : 'text-white/70'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center" style={{ backgroundColor: mentor.color + '20' }}>
                  <i className={`fas ${mentor.icon} text-xs`} style={{ color: mentor.color }}></i>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask ${mentor.name} something...`}
                  rows={1}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#22c55e] resize-none bg-gray-50 placeholder-gray-400"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
              </div>
              <button onClick={handleSend} disabled={!input.trim() || isTyping} className="px-5 py-3 rounded-xl text-white font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0" style={{ background: mentor.color }}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              AI responses are for guidance — always verify from official sources
            </p>
          </div>
        </div>

        {/* Suggested prompts */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1 shrink-0">
          {[
            { text: 'Help me get started', icon: 'fa-play' },
            { text: 'Tips for my situation', icon: 'fa-lightbulb' },
            { text: 'What should I do next?', icon: 'fa-arrow-right' },
            { text: 'Give me an example', icon: 'fa-example' },
          ].map(item => (
            <button key={item.text} onClick={() => setInput(item.text)} className="shrink-0 px-3 py-2 rounded-xl bg-white border border-gray-200 text-gray-500 text-xs font-medium hover:border-gray-300 transition-all flex items-center gap-1.5">
              <i className={`fas ${item.icon}`}></i>
              {item.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
