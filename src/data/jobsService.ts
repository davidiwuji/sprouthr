'use client';

import { createClient } from '@/utils/supabase/client';

export const API_BASE = 'http://localhost:3001';

export interface ApiJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  type: string;
  category: string;
  date_posted: string | null;
  url: string;
  source: string;
  external_id: string;
  synced_at: string;
  created_at: string;
  updated_at: string;
  company_logo?: string;
  experience_level?: string;
  workplace_type?: string;
  deadline?: string | null;
}

export interface JobsQuery {
  page?: number;
  limit?: number;
  type?: string;
  category?: string;
  search?: string;
  location?: string;
  experience_level?: string;
  workplace_type?: string;
  deadline?: string;
}

export interface JobsResult {
  jobs: ApiJob[];
  total: number;
  page: number;
  totalPages: number;
}

export async function fetchJobs(query: JobsQuery = {}): Promise<JobsResult> {
  const supabase = createClient();
  const { page = 1, limit = 20, type, category, search, location, experience_level, workplace_type, deadline } = query;

  /** Try executing a query with (or without) expensive filter columns.
   *  If columns like workplace_type / experience_level / deadline don't exist
   *  in the DB yet, the first attempt fails with code 42703 and we retry
   *  without those filters. */
  const tryQuery = async (withFilters: boolean): Promise<{ data: any; error: any; count: number }> => {
    let q = supabase.from('jobs').select('*', { count: 'exact' });

    if (withFilters) {
      if (type && type !== 'all') {
        if (type === 'job') {
          q = q.in('type', ['Full Time', 'Part Time', 'Contract', 'Remote', 'Freelance']);
        } else if (type === 'internship') {
          q = q.eq('type', 'Internship');
        } else {
          q = q.ilike('type', `%${type}%`);
        }
      }
      if (category && category !== 'all') q = q.eq('category', category);
      if (experience_level && experience_level !== 'all') q = q.eq('experience_level', experience_level);
      if (workplace_type) q = q.eq('workplace_type', workplace_type);
      if (deadline) {
        const now = new Date().toISOString();
        if (deadline === 'within_7') {
          const d7 = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
          q = q.gte('deadline', now).lte('deadline', d7);
        } else if (deadline === 'within_30') {
          const d30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          q = q.gte('deadline', now).lte('deadline', d30);
        } else if (deadline === '30_plus') {
          const d30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          q = q.gte('deadline', d30);
        }
      }
    }

    if (search) q = q.or(`title.ilike.%${search}%,company.ilike.%${search}%,description.ilike.%${search}%`);
    if (location) q = q.ilike('location', `%${location}%`);

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    return await q.order('created_at', { ascending: false }).range(from, to);
  };

  // First attempt with all filters; retry without column-filters on 42703
  let { data, error, count } = await tryQuery(true);
  if (error?.code === '42703') {
    console.warn('DB column missing, retrying without filter columns:', error.message);
    const fallback = await tryQuery(false);
    data = fallback.data; error = fallback.error; count = fallback.count;
  }

  if (error) {
    console.error('Error fetching jobs:', error);
    return { jobs: [], total: 0, page, totalPages: 0 };
  }

  return {
    jobs: (data as ApiJob[]) || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function fetchFeaturedJobs(limit = 6): Promise<ApiJob[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured jobs:', error);
    return [];
  }

  return (data as ApiJob[]) || [];
}

export async function fetchJobById(id: string): Promise<ApiJob | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching job by id:', error);
    return null;
  }

  return data as ApiJob;
}

export function mapJobToType(apiType: string): string {
  const jobTypes = ['Full Time', 'Part Time', 'Contract', 'Remote', 'Freelance'];
  if (jobTypes.includes(apiType)) return 'job';
  if (apiType === 'Internship') return 'internship';
  return 'job'; // default
}

export function mapApiJobToOpportunity(job: ApiJob) {
  const jobType = mapJobToType(job.type);
  // Infer workplace type from the new field or fall back to type-based detection
  const wpType = job.workplace_type
    || (job.type.toLowerCase().includes('remote') ? 'remote'
        : job.type.toLowerCase().includes('hybrid') ? 'hybrid'
        : 'onsite');
  return {
    id: parseInt(job.external_id || '0') || Math.abs(job.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)),
    title: job.title,
    company: job.company || 'Unknown Company',
    logo: job.company_logo 
      ? job.company_logo 
      : job.company 
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=22c55e&color=fff&size=80&bold=true&format=svg`
        : `https://ui-avatars.com/api/?name=SPROUT&background=22c55e&color=fff&size=80&bold=true&format=svg`,
    type: jobType,
    subtype: job.type,
    industry: job.category || 'General',
    jobFunction: '',
    location: { city: job.location || 'Remote', state: '', country: 'Nigeria' },
    workplaceType: wpType,
    salary: job.salary || 'Negotiable',
    experience: job.experience_level || 'entry',
    education: '',
    description: job.description || job.title,
    responsibilities: [],
    requirements: [],
    benefits: [],
    deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
    postedDate: job.date_posted || job.created_at || '',
    status: 'active',
    featured: false,
    applicationUrl: job.url,
    documentsRequired: [],
    aboutCompany: '',
    // Extra fields for API job identification
    _apiUuid: job.id,
    _apiSource: job.source,
  };
}

/**
 * Fetch full job details by scraping the original listing page.
 * Calls the API's detail scraper endpoint.
 */
export async function fetchScrapedJobDetail(jobUrl: string): Promise<{
  description: string;
  salary: string;
  type: string;
  category: string;
  datePosted: string;
  company: string;
  location: string;
  companyLogo?: string;
  requirements: string[];
  responsibilities: string[];
} | null> {
  try {
    const res = await fetch(`${API_BASE}/api/jobs/jobslin/detail?url=${encodeURIComponent(jobUrl)}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.data) return null;

    const data = json.data;
    return {
      description: data.description || data.title || '',
      salary: data.salary || '',
      type: data.employmentType || data.type || '',
      category: data.category || '',
      datePosted: data.datePosted || '',
      company: data.company || '',
      location: data.jobLocation?.address?.addressLocality || data.location || '',
      companyLogo: data.companyLogo || data.imageUrl || '',
      requirements: data.requirements || [],
      responsibilities: data.responsibilities || [],
    };
  } catch {
    return null;
  }
}
