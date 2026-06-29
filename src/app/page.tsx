'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { daysUntil, timeAgo, getTypeBadgeClass, getTypeLabel, formatLocation } from '@/lib/utils';
import Hero3DScroll from '@/components/Hero3DScroll';
import ScrollReveal3D from '@/components/ScrollReveal3D';
import AdBanner from '@/components/AdBanner';

function FeaturedOpportunities() {
  const { navigateTo, toggleBookmark, state } = useApp();
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('jobs').select('*')
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (data) setFeaturedJobs(data);
      });
  }, []);

  if (featuredJobs.length === 0) return null;

  return (
    <section id="browse" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Latest Opportunities</h2>
            <p className="text-gray-500 mt-2">Fresh listings from the database</p>
          </div>
          <button onClick={() => navigateTo('browse')} className="hidden sm:flex items-center gap-2 text-[#22c55e] hover:text-[#16a34a] font-medium text-sm transition-colors">
            View All <i className="fas fa-arrow-right"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredJobs.map((job, i) => (
            <ScrollReveal3D key={job.id} delay={i * 150}>
              <div className="glass rounded-2xl p-6 card-hover cursor-pointer relative group" onClick={() => navigateTo(`opportunity/${job.id}?_apiUuid=${job.id}`)}>
              <button onClick={(e) => {
                e.stopPropagation();
                const wasBookmarked = state.bookmarks.includes(job.id);
                toggleBookmark(job.id);
                const savedJobs = JSON.parse(localStorage.getItem('sprouthr_saved_jobs') || '[]');
                if (wasBookmarked) {
                  localStorage.setItem('sprouthr_saved_jobs', JSON.stringify(savedJobs.filter((j: any) => j.id !== job.id)));
                } else {
                  localStorage.setItem('sprouthr_saved_jobs', JSON.stringify([...savedJobs, {
                    id: job.id,
                    title: job.title,
                    company: job.company || 'Unknown',
                    logo: job.company_logo || `https://ui-avatars.com/api/?name=${job.company || 'SPROUT'}&background=22c55e&color=fff&bold=true&format=svg`,
                    type: job.type || 'Full Time',
                    location: job.location || 'Nigeria',
                    deadline: job.deadline || '',
                  }]));
                }
              }} className="absolute top-4 right-4 text-gray-400 hover:text-[#22c55e] transition-colors">
                <i className={`fas fa-heart ${state.bookmarks.includes(job.id) ? 'text-[#22c55e]' : ''}`}></i>
              </button>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${getTypeBadgeClass('job')}`}>{getTypeLabel('job')}</span>
              <div className="flex items-center gap-3 mt-4 mb-3">
                <img src={job.company_logo || `https://ui-avatars.com/api/?name=${job.company}&background=22c55e&color=fff&bold=true`} alt={job.company} className="w-8 h-8 rounded-lg object-cover" />
                <span className="text-sm text-gray-500">{job.company}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#22c55e] transition-colors">{job.title}</h3>
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                <span><i className="fas fa-map-marker-alt mr-1"></i>{job.location || 'Nigeria'}</span>
                <span><i className="fas fa-clock mr-1"></i>{job.created_at ? timeAgo(job.created_at) : 'Recent'}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">{job.type || 'Full Time'}</span>
                <span className="text-xs font-medium text-[#22c55e]">View Details <i className="fas fa-arrow-right ml-1"></i></span>
              </div>
            </div>
          </ScrollReveal3D>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatWeOffer() {
  const { navigateTo } = useApp();
  const offers = [
    { icon: 'fa-file-pen', title: 'CV Revamping', description: 'Get the CV that works for you. Professional rewriting, ATS optimization, and modern formatting that gets you noticed by recruiters.', color: '#22c55e', bg: '#22c55e/10', link: 'cv-builder' },
    { icon: 'fa-book-open', title: 'Past Questions', description: 'Access verified recruitment past questions and answers for NNPC, Police, Immigration, Banks, Oil & Gas, and more. Updated regularly.', color: '#3b82f6', bg: '#3b82f6/10', link: 'store' },
    { icon: 'fa-user-graduate', title: 'Mentors', description: 'Connect with AI mentors who guide you through your career journey with personalised advice, interview prep, and career planning.', color: '#f59e0b', bg: '#f59e0b/10', link: 'store' },
    { icon: 'fa-briefcase', title: 'Jobs', description: 'Browse thousands of curated opportunities from top employers across Nigeria — jobs, internships, graduate programs, and scholarships.', color: '#ef4444', bg: '#ef4444/10', link: 'browse' },
  ];

  return (
    <section className="py-20 bg-[#f0f2f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>What We Offer</h2>
        <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">Everything you need to land your dream opportunity</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {offers.map((offer, i) => (
            <ScrollReveal3D key={offer.title} delay={i * 200}>
              <div className="bg-white rounded-2xl p-8 card-hover text-center h-full flex flex-col items-center cursor-pointer" onClick={() => navigateTo(offer.link)}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: offer.bg }}>
                  <i className={`fas ${offer.icon} text-2xl`} style={{ color: offer.color }}></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{offer.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{offer.description}</p>
              </div>
            </ScrollReveal3D>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingSoonSection() {
  const { navigateTo } = useApp();
  const [closingJobs, setClosingJobs] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();
    // Fetch jobs with upcoming deadlines (closing soon)
    supabase.from('jobs').select('*')
      .not('deadline', 'is', null)
      .gte('deadline', new Date().toISOString().split('T')[0])
      .order('deadline', { ascending: true })
      .limit(3)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setClosingJobs(data);
        } else {
          // Fallback: newest jobs if none closing soon
          supabase.from('jobs').select('*')
            .order('created_at', { ascending: false })
            .limit(3)
            .then(({ data: fallback }) => {
              if (fallback) setClosingJobs(fallback);
            });
        }
      });
  }, []);

  if (closingJobs.length === 0) return null;

  return (
    <section className="py-20 bg-[#f0f2f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-space text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <i className="fas fa-clock mr-3 text-[#ef4444]"></i>Closing Soon
        </h2>
        <p className="text-gray-500 mb-10 text-center">Don&apos;t miss out — deadlines are approaching</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {closingJobs.map((job, i) => (
            <ScrollReveal3D key={job.id} delay={i * 150}>
              <div className="bg-white rounded-2xl p-6 card-hover cursor-pointer border-l-4 border-l-[#ef4444]" onClick={() => navigateTo(`opportunity/${job.id}?_apiUuid=${job.id}`)}>
                <div className="flex items-center gap-3 mb-3">
                  <img src={job.company_logo || `https://ui-avatars.com/api/?name=${job.company}&background=22c55e&color=fff&bold=true`} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{job.title}</h3>
                    <p className="text-xs text-gray-400">{job.company || 'Unknown Company'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span><i className="fas fa-map-marker-alt mr-1"></i>{job.location || 'Nigeria'}</span>
                  {job.deadline ? (
                    <span className="font-medium text-[#ef4444]">
                      <i className="fas fa-hourglass-half mr-1"></i>
                      {(() => {
                        const diff = Math.ceil((new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                        return diff <= 0 ? 'Closing today' : `${diff} days left`;
                      })()}
                    </span>
                  ) : (
                    <span className="font-medium text-[#22c55e]">{job.type || 'New'}</span>
                  )}
                </div>
              </div>
            </ScrollReveal3D>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { navigateTo, state } = useApp();
  const router = useRouter();
  const [showTelegramBanner, setShowTelegramBanner] = useState(true);

  return (
    <div className="page-transition">
      <Hero3DScroll />

      {/* Telegram Banner */}
      {showTelegramBanner && (
        <div className="bg-gradient-to-r from-[#0088cc]/10 to-[#0088cc]/20 border-y border-[#0088cc]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="fab fa-telegram text-[#0088cc] text-xl"></i>
              <p className="text-sm text-gray-700">Join our <span className="font-semibold">Telegram</span> channel for real-time job alerts!</p>
            </div>
            <div className="flex items-center gap-2">
              <a href="https://t.me/sprouthr" target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 rounded-lg bg-[#0088cc] text-white text-xs font-medium hover:bg-[#0077b5] transition-all">
                <i className="fab fa-telegram mr-1"></i> Join Now
              </a>
              <button onClick={() => setShowTelegramBanner(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      <FeaturedOpportunities />
      <WhatWeOffer />
      <ClosingSoonSection />
    </div>
  );
}
