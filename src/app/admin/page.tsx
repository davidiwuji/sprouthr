'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import Link from 'next/link';
import { storeProducts as initialProducts, type StoreProduct, categoryConfig } from '@/data/store';
import { createClient } from '@/utils/supabase/client';

const SUPER_ADMIN_EMAIL = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || 'davidiwuji1@gmail.com';
const STORAGE_KEY_PRODUCTS = 'sprouthr_admin_products';

type TabType = 'overview' | 'jobs' | 'store' | 'users';
type ProductTabType = 'all' | keyof typeof categoryConfig;

// ─── Helper ───
function loadWithFallback<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function saveToStorage(key: string, data: unknown) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Empty templates ───
const emptyProduct: Omit<StoreProduct, 'id'> = {
  title: '', category: 'general', description: '', price: '',
  features: [], delivery: 'Instant Download', format: 'PDF',
};

export default function AdminPage() {
  const { state, showToast, navigateTo, refreshSession } = useApp();
  const user = state.user;
  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;
  const isAdminUser = isSuperAdmin || user?.user_metadata?.is_admin === true;

  // ─── ALL useState hooks must be at the top (before any early return) ───
  const [tab, setTab] = useState<TabType>('overview');
  const [authChecked, setAuthChecked] = useState(false);
  const [sessionRefreshed, setSessionRefreshed] = useState(false);

  // Products
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editProduct, setEditProduct] = useState<StoreProduct | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'job' | 'product' | 'user'; id: string | number } | null>(null);
  const [productFilter, setProductFilter] = useState<ProductTabType>('all');

  // Jobs
  const [dbJobs, setDbJobs] = useState<any[]>([]);
  const [dbJobsTotal, setDbJobsTotal] = useState(0);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsSearch, setJobsSearch] = useState('');
  const jobsPerPage = 20;

  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Stats
  const [liveJobCount, setLiveJobCount] = useState<number | null>(null);

  // ─── ALL useEffect hooks must also be at the top ───

  // Session refresh — 1st
  useEffect(() => {
    if (state.user && !state.loading && !sessionRefreshed) {
      refreshSession().then(() => {
        setSessionRefreshed(true);
      });
    } else if (!state.user && !state.loading) {
      setSessionRefreshed(true);
    }
  }, [state.loading, state.user]);

  // Auth check — 2nd
  useEffect(() => {
    if (sessionRefreshed && !state.loading) {
      if (!state.user) {
        showToast('Please sign in', 'info');
        navigateTo('auth/signup');
      } else if (!isAdminUser) {
        showToast('Admin access required', 'error');
        navigateTo('dashboard');
      }
      setAuthChecked(true);
    }
  }, [sessionRefreshed, state.loading, state.user, isAdminUser]);

  // Products init
  useEffect(() => {
    setProducts(loadWithFallback(STORAGE_KEY_PRODUCTS, initialProducts));
    setLoaded(true);
  }, []);

  // Products persist
  useEffect(() => {
    if (loaded) saveToStorage(STORAGE_KEY_PRODUCTS, products);
  }, [products, loaded]);

  // Load jobs when tab switches
  useEffect(() => {
    if (tab === 'jobs') loadJobs(jobsPage, jobsSearch);
  }, [tab, jobsPage]);

  // Load users when tab switches
  useEffect(() => {
    if (tab === 'users') loadUsers();
  }, [tab]);

  // Live job count
  useEffect(() => {
    createClient().from('jobs').select('id', { count: 'exact', head: true })
      .then(({ count }) => setLiveJobCount(count))
      .catch(() => {});
  }, []);

  // ─── End of hooks — now the early return ───
  if (state.loading || !authChecked || !state.user || !isAdminUser) {
    return <div className="min-h-screen flex items-center justify-center"><i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i></div>;
  }

  // ─── Function definitions (non-hooks, fine after early return) ───
  const loadJobs = async (page: number, search: string) => {
    setJobsLoading(true);
    try {
      const supabase = createClient();
      const from = (page - 1) * jobsPerPage;
      const to = from + jobsPerPage - 1;
      
      let query = supabase.from('jobs').select('*', { count: 'exact' });
      if (search) {
        query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%`);
      }
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      setDbJobs(data || []);
      setDbJobsTotal(count || 0);
    } catch (err: any) {
      console.error('Failed to load jobs:', err);
      showToast('Failed to load jobs', 'error');
    } finally {
      setJobsLoading(false);
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    setUsersError('');
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!res.ok) {
        setUsersError(data.error || 'Failed to load users');
      } else {
        setUsers(data.users || []);
      }
    } catch (err: any) {
      setUsersError(err.message);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    // Only SuperAdmin can delete users
    if (!isSuperAdmin) {
      showToast('Only Super Admin can delete users', 'error');
      setDeleteConfirm(null);
      return;
    }
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || 'Failed to delete user', 'error');
        return;
      }
      showToast('User deleted', 'info');
      setDeleteConfirm(null);
      loadUsers();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleAdmin = async (id: string, makeAdmin: boolean) => {
    if (!isSuperAdmin) {
      showToast('Only Super Admin can change admin roles', 'error');
      return;
    }
    setTogglingId(id);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_admin: makeAdmin }),
      });
      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || 'Failed to update user', 'error');
        setTogglingId(null);
        return;
      }
      showToast(makeAdmin ? 'Admin added' : 'Admin removed', 'success');
      await loadUsers();
      setTogglingId(null);
    } catch (err: any) {
      showToast(err.message, 'error');
      setTogglingId(null);
    }
  };

  // ─── Product CRUD ───
  const handleSaveProduct = (data: StoreProduct) => {
    if (data.id < 1) {
      const newProduct = { ...data, id: Math.max(0, ...products.map(p => p.id)) + 1 };
      setProducts(prev => [...prev, newProduct]);
      showToast('Product created!', 'success');
    } else {
      setProducts(prev => prev.map(p => p.id === data.id ? data : p));
      showToast('Product updated!', 'success');
    }
    setEditProduct(null);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product deleted', 'info');
    setDeleteConfirm(null);
  };

  const filteredProducts = productFilter === 'all'
    ? products
    : products.filter(p => p.category === productFilter);

  const stats = [
    { icon: 'fa-briefcase', label: 'Live Jobs (Supabase)', value: (liveJobCount ?? '...').toString(), sub: `Showing ${dbJobsTotal} total` },
    { icon: 'fa-store', label: 'Store Products', value: products.length.toString(), sub: `${products.filter(p => p.price).length} with price` },
    { icon: 'fa-users', label: 'Signed In As', value: user?.email?.split('@')[0] || '—', sub: user ? user.email : 'Not signed in' },
  ];

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
    { id: 'jobs', label: 'Jobs', icon: 'fa-briefcase' },
    { id: 'store', label: 'Store', icon: 'fa-store' },
    { id: 'users', label: 'Users', icon: 'fa-users' },
  ];

  const jobTotalPages = Math.ceil(dbJobsTotal / jobsPerPage);

  return (
    <div className="page-transition min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-space flex items-center gap-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <i className="fas fa-shield-halved text-[#22c55e]"></i>
              Admin Dashboard
              {isSuperAdmin && <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">Super Admin</span>}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage jobs, users & store — live data from Supabase</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === t.id ? 'bg-gray-900 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#22c55e] hover:text-[#22c55e]'
            }`}>
              <i className={`fas ${t.icon} mr-1.5`}></i>
              {t.label}
            </button>
          ))}
        </div>

        {/* ═══════════════ OVERVIEW ═══════════════ */}
        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map(s => (
                <div key={s.label} className="glass rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 flex items-center justify-center">
                      <i className={`fas ${s.icon} text-[#22c55e]`}></i>
                    </div>
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{s.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="glass rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 hover:bg-[#22c55e]/10 border border-gray-100 text-left transition-all">
                  <i className="fas fa-plus-circle text-[#22c55e] text-xl mb-2"></i>
                  <p className="text-sm font-medium text-gray-900 mb-2">Add New Job</p>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      const supabase = createClient();
                      const newJob = {
                        title: 'New Job',
                        company: '',
                        location: '',
                        description: '',
                        salary: '',
                        type: 'Full Time',
                        category: '',
                        source: 'sprouthr-admin',
                        external_id: `admin-${Date.now()}`,
                      };
                      supabase.from('jobs').insert([newJob]).then(({ data, error }) => {
                        if (error) showToast(error.message, 'error');
                        else {
                          showToast('Job created!', 'success');
                          setTab('jobs');
                          setJobsPage(1);
                          setTimeout(() => loadJobs(1, ''), 300);
                        }
                      });
                    }} className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:border-[#22c55e] hover:text-[#22c55e] transition-all">
                      <i className="fas fa-pen mr-1"></i> Add Manually
                    </button>
                    <Link href="/admin/paste-job" className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:border-[#22c55e] hover:text-[#22c55e] transition-all text-center block">
                      <i className="fab fa-whatsapp mr-1"></i> Paste
                    </Link>
                  </div>
                </div>
                <button onClick={() => { setTab('store'); setEditProduct({ id: -1, ...emptyProduct } as StoreProduct); }} className="p-4 rounded-xl bg-gray-50 hover:bg-[#22c55e]/10 border border-gray-100 text-left transition-all">
                  <i className="fas fa-cart-plus text-[#22c55e] text-xl mb-1"></i>
                  <p className="text-sm font-medium text-gray-900">Add Store Product</p>
                  <p className="text-xs text-gray-400">Add a new product to store</p>
                </button>
                <Link href="/browse" className="p-4 rounded-xl bg-gray-50 hover:bg-[#22c55e]/10 border border-gray-100 text-left transition-all block">
                  <i className="fas fa-eye text-[#22c55e] text-xl mb-1"></i>
                  <p className="text-sm font-medium text-gray-900">View Site</p>
                  <p className="text-xs text-gray-400">Browse as regular user</p>
                </Link>
                <Link href="/dashboard" className="p-4 rounded-xl bg-gray-50 hover:bg-[#22c55e]/10 border border-gray-100 text-left transition-all block">
                  <i className="fas fa-arrow-right text-[#22c55e] text-xl mb-1"></i>
                  <p className="text-sm font-medium text-gray-900">Dashboard</p>
                  <p className="text-xs text-gray-400">Go to user dashboard</p>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ JOBS (from Supabase) ═══════════════ */}
        {tab === 'jobs' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                All Jobs ({dbJobsTotal})
                {jobsLoading && <span className="text-sm font-normal text-gray-400 ml-2">Loading...</span>}
              </h2>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  value={jobsSearch}
                  onChange={e => { setJobsSearch(e.target.value); setJobsPage(1); }}
                  placeholder="Search title / company..."
                  className="flex-1 sm:w-64 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#22c55e] bg-white"
                />
                <button onClick={() => { setJobsPage(1); loadJobs(1, jobsSearch); }} className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm hover:bg-gray-200">
                  <i className="fas fa-search"></i>
                </button>
                <button onClick={() => { setJobsSearch(''); setJobsPage(1); loadJobs(1, ''); }} className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 whitespace-nowrap">
                  <i className="fas fa-rotate"></i>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">Title</th>
                      <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Company</th>
                      <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Location</th>
                      <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Type</th>
                      <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Date</th>
                      <th className="text-right px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dbJobs.map((job: any) => (
                      <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-gray-900 font-medium truncate max-w-[200px]">{job.title}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-500 hidden sm:table-cell truncate max-w-[150px]">{job.company}</td>
                        <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{job.location || '—'}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{job.type}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                          {job.created_at ? new Date(job.created_at).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setDeleteConfirm({ type: 'job', id: job.id })}
                            className="text-gray-400 hover:text-red-500 px-2"
                            title="Delete from database"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!jobsLoading && dbJobs.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-gray-400">
                          <i className="fas fa-inbox text-3xl mb-2"></i>
                          <p>No jobs found</p>
                        </td>
                      </tr>
                    )}
                    {jobsLoading && (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-gray-400">
                          <i className="fas fa-spinner fa-spin text-xl"></i>
                          <p className="mt-2">Loading jobs...</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {jobTotalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setJobsPage(p => Math.max(1, p - 1))}
                  disabled={jobsPage === 1}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50"
                >
                  <i className="fas fa-chevron-left mr-1"></i> Prev
                </button>
                {Array.from({ length: jobTotalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === jobTotalPages || Math.abs(p - jobsPage) <= 2)
                  .map((num, idx, arr) => (
                    <React.Fragment key={num}>
                      {idx > 0 && arr[idx - 1] !== num - 1 && (
                        <span className="text-gray-400 text-sm px-1">...</span>
                      )}
                      <button
                        onClick={() => setJobsPage(num)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium ${
                          jobsPage === num
                            ? 'bg-[#22c55e] text-white'
                            : 'bg-white border border-gray-200 text-gray-500 hover:border-[#22c55e]'
                        }`}
                      >
                        {num}
                      </button>
                    </React.Fragment>
                  ))}
                <button
                  onClick={() => setJobsPage(p => Math.min(jobTotalPages, p + 1))}
                  disabled={jobsPage === jobTotalPages}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50"
                >
                  Next <i className="fas fa-chevron-right ml-1"></i>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════ STORE ═══════════════ */}
        {tab === 'store' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Store Products ({products.length})</h2>
              <button onClick={() => setEditProduct({ id: -1, ...emptyProduct } as StoreProduct)} className="px-4 py-2 rounded-xl bg-[#22c55e] text-white text-sm font-medium hover:bg-[#16a34a] transition-all">
                <i className="fas fa-plus mr-1.5"></i> Add Product
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">Title</th>
                      <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Category</th>
                      <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Price</th>
                      <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Features</th>
                      <th className="text-right px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map(prod => (
                      <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 text-gray-900 font-medium">{prod.title}</td>
                        <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{categoryConfig[prod.category]?.label || prod.category}</td>
                        <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{prod.price}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{prod.features.length} features</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => setEditProduct(prod)} className="text-gray-400 hover:text-[#22c55e] px-2"><i className="fas fa-pen"></i></button>
                          <button onClick={() => setDeleteConfirm({ type: 'product', id: prod.id })} className="text-gray-400 hover:text-red-500 px-2"><i className="fas fa-trash"></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <i className="fas fa-store text-3xl mb-2"></i>
                  <p>{productFilter === 'all' ? 'No products yet.' : 'No products in this category.'}</p>
                </div>
              )}
            </div>

            {/* Category filter */}
            <div className="flex gap-2 flex-wrap mt-4">
              <button onClick={() => setProductFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${productFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-500'}`}>All</button>
              {Object.entries(categoryConfig).map(([key, cfg]) => (
                <button key={key} onClick={() => setProductFilter(key as ProductTabType)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${productFilter === key ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-500'}`}>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════ USERS ═══════════════ */}
        {tab === 'users' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Users ({users.length})
                {usersLoading && <span className="text-sm font-normal text-gray-400 ml-2">Loading...</span>}
              </h2>
              {!usersError && users.length > 0 && (
                <span className="text-xs text-gray-400">
                  {isSuperAdmin ? 'Super Admin — you can manage admin roles' : 'Admin — you can manage users'}
                </span>
              )}
            </div>

            {usersError ? (
              <div className="glass rounded-2xl p-8 border border-gray-100 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-key text-2xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Role Key Required</h3>
                <p className="text-sm text-gray-500 mb-4 max-w-lg mx-auto">
                  To manage users, add your Supabase <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">service_role</code> key to <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">.env.local</code>:
                </p>
                <div className="inline-block bg-gray-50 rounded-xl px-6 py-3 text-sm font-mono text-gray-700 border border-gray-200 mb-4">
                  SUPABASE_SERVICE_ROLE_KEY=your_key_here
                </div>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Get it from Supabase Dashboard → Project Settings → API → service_role key.
                  <br />This key is required for admin user management operations.
                </p>
              </div>
            ) : usersLoading ? (
              <div className="glass rounded-2xl p-12 text-center">
                <i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                <p className="text-sm text-gray-500 mt-3">Loading users...</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium">Email</th>
                        <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Name</th>
                        <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Role</th>
                        <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Joined</th>
                        <th className="text-center px-4 py-3 font-medium">Admin</th>
                        <th className="text-right px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u: any) => (
                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <span className="text-gray-900 font-medium">{u.email}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                            {u.userMetadata?.full_name || '—'}
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="text-xs text-gray-500">
                              {u.userMetadata?.role || 'jobseeker'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {u.email === SUPER_ADMIN_EMAIL ? (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                                <i className="fas fa-crown text-xs"></i>Owner
                              </span>
                            ) : u.isAdmin ? (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[#22c55e]/10 text-[#22c55e] font-medium">
                                <i className="fas fa-shield-alt text-xs"></i>Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
                                <i className="fas fa-user text-xs"></i>User
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            {/* Toggle admin (SuperAdmin only, not for themselves) */}
                            {isSuperAdmin && u.email !== SUPER_ADMIN_EMAIL && (
                              <button
                                onClick={() => handleToggleAdmin(u.id, !u.isAdmin)}
                                disabled={togglingId === u.id}
                                className={`text-xs px-3 py-1.5 rounded-lg font-medium mr-1 transition-all ${
                                  togglingId === u.id
                                    ? 'bg-gray-100 text-gray-400 cursor-wait'
                                    : u.isAdmin
                                      ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                      : 'bg-gray-50 text-gray-500 hover:bg-[#22c55e]/10 hover:text-[#22c55e]'
                                }`}
                                title={u.isAdmin ? 'Remove admin' : 'Make admin'}
                              >
                                {togglingId === u.id ? (
                                  <i className="fas fa-spinner fa-spin mr-1"></i>
                                ) : (
                                  <i className={`fas ${u.isAdmin ? 'fa-user-minus' : 'fa-user-plus'} mr-1`}></i>
                                )}
                                {togglingId === u.id ? '...' : (u.isAdmin ? 'Demote' : 'Promote')}
                              </button>
                            )}
                            {isSuperAdmin && u.email !== SUPER_ADMIN_EMAIL && (
                              <button
                                onClick={() => setDeleteConfirm({ type: 'user', id: u.id })}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="Delete user"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Delete confirmation modal */}
            {deleteConfirm && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={() => setDeleteConfirm(null)}>
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
                  <h3 className="font-semibold text-gray-900 mb-2">Confirm Delete</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to delete this {deleteConfirm.type}? This cannot be undone.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200">
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (deleteConfirm.type === 'user') handleDeleteUser(deleteConfirm.id as string);
                        else if (deleteConfirm.type === 'job') {
                          createClient().from('jobs').delete().eq('id', deleteConfirm.id).then(({ error }) => {
                            if (error) showToast(error.message, 'error');
                            else { showToast('Job deleted', 'info'); setDeleteConfirm(null); loadJobs(jobsPage, jobsSearch); }
                          });
                        } else if (deleteConfirm.type === 'product') handleDeleteProduct(deleteConfirm.id as number);
                      }}
                      className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Product edit modal */}
            {editProduct && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={() => setEditProduct(null)}>
                <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {editProduct.id < 1 ? 'Add Product' : 'Edit Product'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Title</label>
                      <input type="text" value={editProduct.title} onChange={e => setEditProduct({ ...editProduct, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#22c55e]" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Category</label>
                      <select value={editProduct.category} onChange={e => setEditProduct({ ...editProduct, category: e.target.value as any })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#22c55e] bg-white">
                        {Object.entries(categoryConfig).map(([key, cfg]) => (
                          <option key={key} value={key}>{cfg.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Price (₦)</label>
                      <input type="text" value={editProduct.price} onChange={e => setEditProduct({ ...editProduct, price: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#22c55e]" placeholder="₦3,500" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Description</label>
                      <textarea value={editProduct.description} onChange={e => setEditProduct({ ...editProduct, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#22c55e]" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Delivery Method</label>
                      <input type="text" value={editProduct.delivery || ''} onChange={e => setEditProduct({ ...editProduct, delivery: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#22c55e]" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Format</label>
                      <input type="text" value={editProduct.format || ''} onChange={e => setEditProduct({ ...editProduct, format: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#22c55e]" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Features (one per line)</label>
                      <textarea
                        value={editProduct.features.join('\n')}
                        onChange={e => setEditProduct({ ...editProduct, features: e.target.value.split('\n').filter(f => f.trim()) })}
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#22c55e]"
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setEditProduct(null)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200">Cancel</button>
                    <button onClick={() => handleSaveProduct(editProduct)} className="px-4 py-2 rounded-xl bg-[#22c55e] text-white text-sm font-medium hover:bg-[#16a34a]">
                      <i className="fas fa-save mr-1"></i> Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}