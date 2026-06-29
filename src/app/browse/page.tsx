'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { fetchJobs, mapApiJobToOpportunity, mapJobToType, type ApiJob } from '@/data/jobsService';
import { getTypeBadgeClass, getTypeLabel, daysUntil, timeAgo, formatLocation } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

export default function BrowsePage() {
  const { navigateTo, toggleBookmark, state } = useApp();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [mobileFilters, setMobileFilters] = useState(false);
  const [apiJobs, setApiJobs] = useState<ReturnType<typeof mapApiJobToOpportunity>[]>([]);
  const [apiTotal, setApiTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const perPage = 20;

  // Read ?category= from URL and pre-select filter
  const urlCategory = searchParams.get('category');
  const [filters, setFilters] = useState<Record<string, string[]>>({
    category: urlCategory ? [urlCategory] : [],
    experience: [], workplace: [], deadline: [],
  });

  // Sync URL param to filter state if it changes
  useEffect(() => {
    if (urlCategory && !filters.category.includes(urlCategory)) {
      setFilters(prev => ({ ...prev, category: [urlCategory] }));
    }
  }, [urlCategory]);

  const filterOptions = [
    { key: 'category', title: 'Opportunity Type', options: ['job', 'internship', 'scholarship', 'fellowship', 'graduate', 'bootcamp', 'grant', 'volunteer'] },
    { key: 'experience', title: 'Experience Level', options: ['entry', 'intermediate', 'senior', 'lead', 'all'] },
    { key: 'workplace', title: 'Workplace Type', options: ['remote', 'hybrid', 'onsite'] },
    { key: 'deadline', title: 'Deadline', options: [{ value: '1-7', label: 'Within 7 days' }, { value: '8-30', label: 'Within 30 days' }, { value: '30+', label: '30+ days' }] },
  ];

  // Fetch API jobs on mount and when filters/page/search change
  useEffect(() => {
    let activeCategory: string | undefined;
    if (filters.category?.length === 1) {
      activeCategory = filters.category[0];
    }

    // Map experience filter (take first selected, or undefined)
    const activeExp = filters.experience.length === 1 ? filters.experience[0] : undefined;
    // Map workplace filter
    const activeWp = filters.workplace.length === 1 ? filters.workplace[0] : undefined;
    // Map deadline filter  
    let activeDeadline: string | undefined;
    if (filters.deadline.length === 1) {
      const d = filters.deadline[0];
      if (d === '1-7') activeDeadline = 'within_7';
      else if (d === '8-30') activeDeadline = 'within_30';
      else if (d === '30+') activeDeadline = '30_plus';
    }

    setLoading(true);
    fetchJobs({
      page,
      limit: perPage,
      category: activeCategory,
      search: search || undefined,
      experience_level: activeExp,
      workplace_type: activeWp,
      deadline: activeDeadline,
    }).then(result => {
      setApiJobs(result.jobs.map(j => mapApiJobToOpportunity(j)));
      setApiTotal(result.total);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page, search, filters]);

  const toggleFilter = (section: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [section]: prev[section].includes(value)
        ? prev[section].filter(v => v !== value)
        : [...prev[section], value],
    }));
    setPage(1);
  };

  // Only show API-fetched jobs (no mock data)
  const filtered = useMemo(() => {
    let result = [...apiJobs];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(o =>
        o.title.toLowerCase().includes(q) ||
        o.company.toLowerCase().includes(q) ||
        (typeof o.location === 'string' ? o.location : o.location?.city || '').toLowerCase().includes(q)
      );
    }
    if (filters.category.length > 0) {
      result = result.filter(o => filters.category.includes(o.industry));
    }
    if (filters.workplace.length > 0) {
      result = result.filter(o => filters.workplace.includes(o.workplaceType));
    }
    if (filters.deadline.length > 0) {
      result = result.filter(o => {
        const days = parseInt(daysUntil(o.deadline));
        return filters.deadline.some(d => {
          if (d === '1-7') return days >= 1 && days <= 7;
          if (d === '8-30') return days >= 8 && days <= 30;
          if (d === '30+') return days > 30 || isNaN(days);
          return false;
        });
      });
    }
    result.sort((a, b) => {
      if (sort === 'newest') return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      if (sort === 'deadline') return parseInt(daysUntil(a.deadline)) - parseInt(daysUntil(b.deadline));
      return 0;
    });
    return result;
  }, [search, filters, sort, apiJobs]);

  const totalPages = Math.ceil(apiTotal / perPage);
  const paginated = filtered;

  return (
    <div className="page-transition min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Browse Opportunities</h1>
            <p className="text-gray-500 text-sm">Find your next career move — jobs, internships, scholarships and more</p>
          </div>
          <button onClick={() => setMobileFilters(true)} className="md:hidden px-4 py-2 rounded-xl glass text-gray-500 text-sm">
            <i className="fas fa-filter mr-2"></i> Filters
          </button>
        </div>

        <div className="flex gap-6">
          {/* Filters sidebar */}
          <div className={`md:block w-64 flex-shrink-0 ${mobileFilters ? 'fixed inset-0 z-50 p-4 pt-16 bg-[#f0f2f5] overflow-y-auto' : 'hidden'}`}>
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button onClick={() => setMobileFilters(false)} className="md:hidden text-gray-400 hover:text-gray-900"><i className="fas fa-times"></i></button>
              </div>

              <div className="space-y-6">
                {filterOptions.map(section => (
                  <div key={section.key}>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">{section.title}</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto filter-scroll">
                      {section.options.map((opt: any) => {
                        const val = typeof opt === 'string' ? opt : opt.value;
                        const label = typeof opt === 'string' ? opt.replace('_', ' ') : opt.label;
                        return (
                          <label key={val} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" checked={(filters[section.key] as string[]).includes(val)} onChange={() => toggleFilter(section.key, val)} className="w-4 h-4 rounded border-gray-200 bg-white accent-[#22c55e]" />
                            <span className="text-sm text-gray-500 group-hover:text-gray-900 capitalize">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => { setFilters({ category: [], experience: [], workplace: [], deadline: [] }); setMobileFilters(false); }} className="w-full mt-6 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300 transition-colors">
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by title, company, or location..." className="w-full pl-12 pr-4 py-3 bg-white rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none border border-gray-200" />
              </div>
              <select value={sort} onChange={e => setSort(e.target.value)} className="bg-white text-sm text-gray-500 px-3 py-3 rounded-xl border border-gray-200 focus:outline-none">
                <option value="newest">Newest First</option>
                <option value="deadline">Deadline (Soonest)</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="w-10 h-10 rounded-lg bg-[#22c55e]/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <i className="fas fa-seedling text-[#22c55e]"></i>
                </div>
                <p className="text-gray-500">Loading live jobs...</p>
              </div>
            ) : paginated.length === 0 && !loading ? (
              <div className="text-center py-16">
                <i className="fas fa-inbox text-3xl text-gray-300 mb-3"></i>
                <p className="text-gray-400 text-sm">Check back later for new postings</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginated.map((opp: any) => (
                  <div key={opp.id} className="glass rounded-2xl p-6 card-hover cursor-pointer relative group" onClick={() => {
                    if (opp._apiUuid) {
                      navigateTo(`opportunity/${opp.id}?_apiUuid=${opp._apiUuid}`);
                    } else {
                      navigateTo(`opportunity/${opp.id}`);
                    }
                  }}>
                    <button onClick={(e) => {
                      e.stopPropagation();
                      const wasBookmarked = state.bookmarks.includes(opp.id);
                      toggleBookmark(opp.id);
                      // Save/remove job metadata in localStorage for Dashboard
                      const savedJobs = JSON.parse(localStorage.getItem('sprouthr_saved_jobs') || '[]');
                      if (wasBookmarked) {
                        localStorage.setItem('sprouthr_saved_jobs', JSON.stringify(savedJobs.filter((j: any) => j.id !== opp.id)));
                      } else {
                        localStorage.setItem('sprouthr_saved_jobs', JSON.stringify([...savedJobs, {
                          id: opp.id,
                          title: opp.title,
                          company: opp.company,
                          logo: opp.logo,
                          type: opp.type,
                          location: typeof opp.location === 'string' ? opp.location : (opp.location?.city || ''),
                          deadline: opp.deadline || '',
                        }]));
                      }
                    }} className="absolute top-4 right-4 text-gray-400 hover:text-[#22c55e] transition-colors">
                      <i className={`fas fa-heart ${state.bookmarks.includes(opp.id) ? 'text-[#22c55e]' : ''}`}></i>
                    </button>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getTypeBadgeClass(opp.type)}`}>{getTypeLabel(opp.type)}</span>
                    <div className="flex items-center gap-3 mt-3 mb-2">
                      <img src={opp.logo} alt={opp.company} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-sm text-gray-500">{opp.company}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#22c55e] transition-colors">{opp.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 flex-wrap">
                      <span><i className="fas fa-map-marker-alt mr-1"></i>{formatLocation(opp.location)}</span>
                      <span><i className="fas fa-clock mr-1"></i>{timeAgo(opp.postedDate)}</span>
                      {opp.deadline && daysUntil(opp.deadline) <= 30 && <span>{daysUntil(opp.deadline)}d left</span>}
                      {opp.deadline && daysUntil(opp.deadline) > 30 && <span className="text-[#22c55e]">Open</span>}
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500 capitalize">{opp.subtype || opp.type}</span>
                      {opp.applicationUrl && (
                        <a href={opp.applicationUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-xs font-medium text-[#22c55e] hover:underline">
                          Apply Now <i className="fas fa-external-link-alt ml-1"></i>
                        </a>
                      )}
                      {!opp.applicationUrl && (
                        <span className="text-xs font-medium text-[#22c55e]">View Details <i className="fas fa-arrow-right ml-1"></i></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && !loading && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl glass text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50"><i className="fas fa-chevron-left mr-1"></i> Previous</button>
                {(() => {
                  const windowSize = 5;
                  const startPage = Math.floor((page - 1) / windowSize) * windowSize + 1;
                  const endPage = Math.min(startPage + windowSize - 1, totalPages);
                  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(num => (
                    <button key={num} onClick={() => setPage(num)} className={`w-10 h-10 rounded-xl text-sm font-medium ${page === num ? 'accent-gradient text-white' : 'glass text-gray-500 hover:text-gray-900'}`}>{num}</button>
                  ));
                })()}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-xl glass text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50">Next <i className="fas fa-chevron-right ml-1"></i></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
