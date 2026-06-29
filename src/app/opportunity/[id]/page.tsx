'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { opportunities } from '@/data/opportunities';
import { fetchJobById, mapApiJobToOpportunity, fetchScrapedJobDetail, API_BASE } from '@/data/jobsService';
import { getTypeBadgeClass, getTypeLabel, daysUntil, formatPrice, formatLocation } from '@/lib/utils';
import { useParams, useSearchParams } from 'next/navigation';

export default function OpportunityDetailPage() {
  const { navigateTo, showToast, toggleBookmark, state } = useApp();
  const params = useParams();
  const searchParams = useSearchParams();
  const [showApply, setShowApply] = useState(false);
  const [appForm, setAppForm] = useState({ name: '', email: '', phone: '', coverLetter: '' });
  const [apiOpp, setApiOpp] = useState<any>(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const [scrapedDetails, setScrapedDetails] = useState<any>(null);
  const [scraping, setScraping] = useState(false);

  const id = Number(params.id);
  const localOpp = opportunities.find(o => o.id === id);

  // Check for API job query params
  const apiUuid = searchParams?.get('_apiUuid');
  const jobUrl = searchParams?.get('url');

  // If URI params exist, fetch from API / scrape detail
  useEffect(() => {
    if (localOpp) return; // local job — no fetching needed

    const loadApiJob = async () => {
      setLoadingApi(true);

      // Try fetching by UUID from Supabase first
      if (apiUuid) {
        const job = await fetchJobById(apiUuid);
        if (job) {
          setApiOpp(mapApiJobToOpportunity(job));
          setLoadingApi(false);

          // Then scrape full detail from the listing page (URL from DB, not query param)
          if (job.url) {
            setScraping(true);
            const detail = await fetchScrapedJobDetail(job.url);
            if (detail) setScrapedDetails(detail);
            setScraping(false);
          }
          return;
        }
      }

      // Fallback: if we still have a URL from query params (legacy), try scraping
      if (jobUrl) {
        setScraping(true);
        const decodedUrl = decodeURIComponent(jobUrl);
        const detail = await fetchScrapedJobDetail(decodedUrl);
        if (detail) {
          setScrapedDetails(detail);
          setApiOpp({
            id,
            title: detail.description?.split('.')[0] || 'Job Opportunity',
            company: detail.company || 'Company',
            logo: detail.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(detail.company || 'C')}&background=22c55e&color=fff&size=80`,
            type: 'job',
            subtype: detail.type,
            location: { city: detail.location || 'Remote', state: '', country: 'Nigeria' },
            salary: detail.salary || 'Negotiable',
            description: detail.description,
            responsibilities: detail.responsibilities || [],
            requirements: detail.requirements || [],
            postedDate: detail.datePosted || '',
            applicationUrl: decodedUrl,
            workplaceType: detail.type?.toLowerCase().includes('remote') ? 'remote' : 'onsite',
          });
        }
        setScraping(false);
      }

      setLoadingApi(false);
    };

    loadApiJob();
  }, [localOpp, apiUuid, jobUrl, id]);

  // Use the best available data: local > API-mapped > scraped details
  const opp = localOpp || apiOpp;

  // Merge scraped details into the displayed opportunity
  const displayOpp = opp ? {
    ...opp,
    ...(scrapedDetails ? {
      description: scrapedDetails.description || opp.description,
      salary: scrapedDetails.salary || opp.salary,
      responsibilities: scrapedDetails.responsibilities?.length > 0 ? scrapedDetails.responsibilities : opp.responsibilities,
      requirements: scrapedDetails.requirements?.length > 0 ? scrapedDetails.requirements : opp.requirements,
      // Use company logo from scraped detail if available
      ...(scrapedDetails.companyLogo ? { logo: scrapedDetails.companyLogo } : {}),
    } : {}),
  } : null;

  if ((!displayOpp && loadingApi) || scraping) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg bg-[#22c55e]/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <i className="fas fa-seedling text-[#22c55e]"></i>
          </div>
          <p className="text-gray-500">{scraping ? 'Fetching job details...' : 'Loading opportunity...'}</p>
        </div>
      </div>
    );
  }

  if (!displayOpp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-circle text-5xl text-gray-400 mb-4"></i>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Opportunity Not Found</h1>
          <p className="text-gray-500 mb-6">The opportunity you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigateTo('browse')} className="px-6 py-3 rounded-xl accent-gradient text-white font-medium">Browse Opportunities</button>
        </div>
      </div>
    );
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.user) { showToast('Please sign in to apply', 'info'); navigateTo('auth/signup'); return; }
    showToast('Application submitted! We will contact you soon.', 'success');
    setShowApply(false);
    setAppForm({ name: '', email: '', phone: '', coverLetter: '' });
  };

  const oppLocation = formatLocation(displayOpp.location);

  // Apply via email instead of opening external website
  const handleApplyEmail = () => {
    if (!state.user) {
      showToast('Please sign in to apply', 'info');
      navigateTo('auth/signup');
      return;
    }

    const subject = encodeURIComponent(`Application for ${displayOpp.title} - ${displayOpp.company}`);
    const bodyLines = [
      `Dear Hiring Team,`,
      ``,
      `I am writing to express my interest in the ${displayOpp.title} position at ${displayOpp.company}.`,
      ``,
      `---`,
      `Position: ${displayOpp.title}`,
      `Company: ${displayOpp.company}`,
      `Location: ${oppLocation}`,
      `Type: ${displayOpp.subtype || displayOpp.type}`,
      `Salary: ${displayOpp.salary || 'Negotiable'}`,
      ``,
      `---`,
      `Powered by SPROUT`,
      `Find your dream opportunity at https://sprouthr.com`,
    ].join('\n');
    const body = encodeURIComponent(bodyLines);

    window.location.href = `mailto:apply@sprouthr.com?subject=${subject}&body=${body}`;
    showToast('Email application opened in your email client', 'info');
  };

  return (
    <div className="page-transition min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigateTo('browse')} className="flex items-center gap-2 text-gray-500 hover:text-[#22c55e] mb-6 transition-colors">
          <i className="fas fa-arrow-left"></i> Back to Browse
        </button>

        <div className="glass rounded-3xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <img src={displayOpp.logo} alt={displayOpp.company} className="w-16 h-16 rounded-2xl object-cover" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{displayOpp.title}</h1>
                <p className="text-gray-500">{displayOpp.company}</p>
              </div>
            </div>
            <button onClick={() => toggleBookmark(displayOpp.id)} className={`p-3 rounded-xl transition-colors ${state.bookmarks.includes(displayOpp.id) ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400 hover:text-red-500'}`}>
              <i className={`fas fa-heart ${state.bookmarks.includes(displayOpp.id) ? 'text-red-500' : ''}`}></i>
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getTypeBadgeClass(displayOpp.type)}`}>{getTypeLabel(displayOpp.type)}</span>
            {displayOpp.subtype && <span className="text-xs px-3 py-1 rounded-full font-medium bg-gray-100 text-gray-600">{displayOpp.subtype}</span>}
            {displayOpp.workplaceType && <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-50 text-blue-600"><i className="fas fa-building mr-1"></i>{displayOpp.workplaceType}</span>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { icon: 'fa-map-marker-alt', label: 'Location', value: oppLocation },
              { icon: 'fa-clock', label: 'Type', value: displayOpp.subtype || displayOpp.type },
              { icon: 'fa-briefcase', label: 'Experience', value: displayOpp.experience || 'N/A' },
              { icon: 'fa-money-bill-wave', label: 'Salary', value: displayOpp.salary || 'Negotiable' },
            ].map(d => (
              <div key={d.label} className="p-4 rounded-xl bg-gray-50">
                <i className={`fas ${d.icon} text-[#22c55e] text-sm mb-1`}></i>
                <p className="text-xs text-gray-400">{d.label}</p>
                <p className="text-sm font-medium text-gray-900 capitalize">{d.value}</p>
              </div>
            ))}
          </div>

          {/* Description section */}
          {displayOpp.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Description</h3>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">{displayOpp.description}</div>
            </div>
          )}

          {/* Requirements section */}
          {displayOpp.requirements && displayOpp.requirements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">✅ Requirements</h3>
              <ul className="space-y-2">
                {displayOpp.requirements.map((r: string, i: number) => (<li key={i} className="flex items-start gap-2 text-gray-600"><i className="fas fa-check-circle text-[#22c55e] mt-1"></i>{r}</li>))}
              </ul>
            </div>
          )}

          {/* Responsibilities section */}
          {displayOpp.responsibilities && displayOpp.responsibilities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Responsibilities</h3>
              <ul className="space-y-2">
                {displayOpp.responsibilities.map((r: string, i: number) => (<li key={i} className="flex items-start gap-2 text-gray-600"><i className="fas fa-check text-[#22c55e] mt-1"></i>{r}</li>))}
              </ul>
            </div>
          )}

          {/* Benefits/Perks section */}
          {displayOpp.benefits && displayOpp.benefits.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🎁 Benefits & Perks</h3>
              <ul className="space-y-2">
                {displayOpp.benefits.map((b: string, i: number) => (<li key={i} className="flex items-start gap-2 text-gray-600"><i className="fas fa-gift text-[#22c55e] mt-1"></i>{b}</li>))}
              </ul>
            </div>
          )}

          {/* Deadline info */}
          {displayOpp.deadline && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-sm text-amber-700">
                <i className="fas fa-clock mr-2"></i>
                <strong>Deadline:</strong> {new Date(displayOpp.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                {` (${daysUntil(displayOpp.deadline)} days remaining)`}
              </p>
            </div>
          )}

          <button
            onClick={handleApplyEmail}
            className="w-full py-4 rounded-2xl accent-gradient text-white font-semibold text-lg hover:shadow-lg hover:shadow-[#22c55e]/25 transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-envelope"></i>
            Apply via Email
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">
            Your application will be sent via email with your details. Powered by SproutHR.
          </p>

          {showApply && (
            <form onSubmit={handleApply} className="mt-6 space-y-4">
              <input type="text" value={appForm.name} onChange={e => setAppForm(p => ({ ...p, name: e.target.value }))} placeholder="Full Name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:outline-none focus:border-[#22c55e]" />
              <input type="email" value={appForm.email} onChange={e => setAppForm(p => ({ ...p, email: e.target.value }))} placeholder="Email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:outline-none focus:border-[#22c55e]" />
              <input type="tel" value={appForm.phone} onChange={e => setAppForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:outline-none focus:border-[#22c55e]" />
              <textarea value={appForm.coverLetter} onChange={e => setAppForm(p => ({ ...p, coverLetter: e.target.value }))} placeholder="Cover Letter (optional)" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white focus:outline-none focus:border-[#22c55e]" />
              <button type="submit" className="w-full py-3 rounded-xl bg-[#22c55e] text-white font-semibold hover:bg-[#16a34a] transition-all">Submit Application</button>
            </form>
          )}
        </div>

        {displayOpp.aboutCompany && (
          <div className="glass rounded-3xl p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About {displayOpp.company}</h3>
            <p className="text-gray-600 leading-relaxed">{displayOpp.aboutCompany}</p>
          </div>
        )}
      </div>
    </div>
  );
}
