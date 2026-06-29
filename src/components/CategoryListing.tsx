'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/lib/AppContext';
import { fetchJobs, mapApiJobToOpportunity, type ApiJob } from '@/data/jobsService';
import { formatLocation, daysUntil, timeAgo, getTypeLabel } from '@/lib/utils';
import Link from 'next/link';

interface CategoryListingProps {
  type: string;
  title: string;
  subtitle: string;
  heroGradient?: string;
  icon?: string;
}

export default function CategoryListing({ type, title, subtitle, heroGradient = 'from-[#22c55e] to-[#16a34a]', icon = 'fa-briefcase' }: CategoryListingProps) {
  const { navigateTo, toggleBookmark, state, user, requireAuth } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'deadline' | 'company'>('latest');
  const [apiJobs, setApiJobs] = useState<ReturnType<typeof mapApiJobToOpportunity>[]>([]);
  const [apiTotal, setApiTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch from Supabase using the category filter
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const loadJobs = async () => {
      try {
        const result = await fetchJobs({
          category: type,
          limit: 200,
        });
        if (mounted) {
          const mapped = (result.jobs || []).map(mapApiJobToOpportunity);
          setApiJobs(mapped);
          setApiTotal(result.total);
        }
      } catch (err) {
        console.error(`Failed to fetch ${type} jobs:`, err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadJobs();
    return () => { mounted = false; };
  }, [type]);

  // Apply client-side search and sort
  const filtered = useMemo(() => {
    let list = [...apiJobs];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(o =>
        o.title.toLowerCase().includes(q) ||
        o.company.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'deadline') {
      list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sortBy === 'company') {
      list.sort((a, b) => a.company.localeCompare(b.company));
    } else {
      list.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }

    return list;
  }, [apiJobs, searchQuery, sortBy]);

  const handleApply = (e: React.MouseEvent, oppId: number) => {
    e.stopPropagation();
    if (!user) {
      requireAuth('auth/signup');
      return;
    }
    navigateTo(`opportunity/${oppId}`);
  };

  return (
    <div className="page-transition min-h-screen">
      {/* Hero */}
      <div className={`relative py-20 bg-gradient-to-br ${heroGradient}`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <i className="fas fa-arrow-left text-sm"></i> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <i className={`fas ${icon} text-2xl text-white`}></i>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h1>
              <p className="text-white/80 mt-1">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm text-text-primary"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {loading ? 'Loading...' : `${apiTotal} ${title.toLowerCase()} found`}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent text-text-primary"
              >
                <option value="latest">Latest</option>
                <option value="deadline">Deadline</option>
                <option value="company">Company</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Loading opportunities...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <i className="fas fa-search text-3xl text-gray-300"></i>
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No {title.toLowerCase()} found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchQuery ? 'Try a different search term' : 'Check back later for new listings'}
            </p>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="mt-4 text-accent hover:text-accent-dark text-sm font-medium">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => navigateTo(`opportunity/${opp.id}`)}
                  className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {opp.logo ? (
                        <img src={opp.logo} alt={opp.company} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-gray-400">{opp.company.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors truncate">{opp.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{opp.company}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleBookmark(opp.id); }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${state.bookmarks.has(opp.id) ? 'text-accent bg-accent/10' : 'text-gray-300 hover:text-gray-400 hover:bg-gray-100'}`}
                    >
                      <i className={`fas ${state.bookmarks.has(opp.id) ? 'fa-bookmark' : 'fa-bookmark'}`}></i>
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {opp.type && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-medium capitalize">
                        {opp.type}
                      </span>
                    )}
                    {opp.location && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        {formatLocation(opp.location)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{opp.description}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      {opp.deadline && daysUntil(opp.deadline) !== null && (
                        <>
                          {daysUntil(opp.deadline) > 0
                            ? `${daysUntil(opp.deadline)} days left`
                            : daysUntil(opp.deadline) === 0
                            ? 'Last day'
                            : 'Closed'}
                        </>
                      )}
                      <span className="mx-2">•</span>
                      {timeAgo(opp.postedDate)}
                    </div>
                    <button
                      onClick={(e) => handleApply(e, opp.id)}
                      className="text-xs font-medium text-accent hover:text-accent-dark transition-colors"
                    >
                      Apply now <i className="fas fa-arrow-right ml-1 text-[10px]"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {apiTotal > filtered.length && (
              <div className="text-center mt-10">
                <Link
                  href={`/browse`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent-dark transition-colors font-medium"
                >
                  View all {title.toLowerCase()} on Browse <i className="fas fa-arrow-right text-sm"></i>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
