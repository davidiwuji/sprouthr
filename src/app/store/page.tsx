'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { storeProducts, categoryConfig, type StoreCategory } from '@/data/store';
import Link from 'next/link';

export default function StorePage() {
  const { state } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const categoryOrder: (StoreCategory | 'all')[] = [
    'all', 'federal-govt', 'military', 'oil-gas', 'teaching', 'banking',
    'graduate', 'medical', 'private', 'engineering', 'general', 'cv-service', 'mentorship',
  ];
  const categories = categoryOrder.filter(c => c === 'all' || storeProducts.some(p => p.category === c));

  const filtered = storeProducts.filter(p => {
    const matchCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const [expandedFeatures, setExpandedFeatures] = useState<Set<number>>(new Set());
  const [purchasing, setPurchasing] = useState<{ productId: number; step: 'thanks' | 'sending' | 'sent' | 'error'; message?: string } | null>(null);

  const toggleFeatures = (id: number) => {
    setExpandedFeatures(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handlePurchase = (productId: number) => {
    setPurchasing({ productId, step: 'thanks' });
  };

  const handleContinue = async () => {
    if (!purchasing) return;
    setPurchasing({ ...purchasing, step: 'sending' });

    try {
      const res = await fetch('/api/store/request-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: purchasing.productId }),
      });
      const data = await res.json();

      if (data.success) {
        // Open the direct signed URL if available (10-min link)
        if (data.signedUrl) {
          window.open(data.signedUrl, '_blank');
        } else if (data.downloadPageUrl) {
          window.open(data.downloadPageUrl, '_blank');
        }
        setPurchasing({ ...purchasing, step: 'sent', message: data.message });
      } else {
        setPurchasing({ ...purchasing, step: 'error', message: data.error || 'Something went wrong' });
      }
    } catch (err: any) {
      setPurchasing({ ...purchasing, step: 'error', message: err?.message || 'Network error — try again.' });
    }
  };

  const currentProduct = purchasing ? storeProducts.find(p => p.id === purchasing.productId) : null;

  return (
    <div className="page-transition min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <i className="fas fa-store mr-3 text-[#22c55e]"></i>Store
            </h1>
            <p className="text-gray-500 mt-1">Past questions, CV services, mentorship & more for your career success</p>
          </div>
          <Link href="/cv-builder" className="px-6 py-3 rounded-xl accent-gradient text-white font-medium text-sm whitespace-nowrap shadow-sm">
            <i className="fas fa-file-pen mr-2"></i>Build Your CV
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title, agency, or keyword..." className="w-full pl-12 pr-4 py-3 bg-white rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none border border-gray-200" />
          </div>
          <div className="flex gap-2 flex-wrap max-w-3xl">
            {categories.map(cat => {
              const cfg = cat !== 'all' ? categoryConfig[cat] : null;
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat ? 'text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#22c55e] hover:text-[#22c55e]'
                }`} style={activeCategory === cat && cfg ? { backgroundColor: cfg.color } : {}}>
                  {cfg && <i className={`fas ${cfg.icon} mr-1.5`}></i>}
                  {cat === 'all' ? 'All' : cfg?.label || cat}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try a different category or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => {
              const catCfg = categoryConfig[product.category];
              return (
              <div key={product.id} className={`glass rounded-2xl p-6 card-hover cursor-pointer relative ${product.popular ? 'ring-2 ring-[#22c55e]' : ''}`}>
                <div className="absolute top-4 right-4 flex gap-2">
                  {product.badge && (
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      product.badge === 'Best Seller' || product.badge === '🔥 Best Deal'
                        ? 'bg-[#22c55e]/10 text-[#22c55e]'
                        : product.badge === 'Top Rated' || product.badge === 'Popular'
                        ? 'bg-yellow-100 text-yellow-700'
                        : product.badge === 'Sale' || product.badge === 'Best Value'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: catCfg?.color + '20' || '#22c55e20' }}>
                    <i className={`fas ${catCfg?.icon || 'fa-box'}`} style={{ color: catCfg?.color || '#22c55e' }}></i>
                  </div>
                </div>

                {product.subcategory && (
                  <span className="text-xs text-gray-400 uppercase tracking-wider">{product.subcategory}</span>
                )}

                <h3 className="text-lg font-semibold text-gray-900 mt-1 mb-2">{product.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-gray-900 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
                  )}
                </div>

                <ul className="space-y-1.5 mb-4">
                  {(expandedFeatures.has(product.id) ? product.features : product.features.slice(0, 3)).map((f, i) => (
                    <li key={i} className="text-xs text-gray-500 flex items-start gap-2">
                      <i className="fas fa-check" style={{ color: catCfg?.color || '#22c55e' }}></i>
                      {f}
                    </li>
                  ))}
                  {product.features.length > 3 && (
                    <li>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFeatures(product.id); }}
                        className="text-xs hover:underline font-medium flex items-center gap-1" style={{ color: catCfg?.color || '#22c55e' }}
                      >
                        {expandedFeatures.has(product.id) ? (
                          <><i className="fas fa-chevron-up"></i> Show less</>
                        ) : (
                          <><i className="fas fa-chevron-down"></i> +{product.features.length - 3} more</>
                        )}
                      </button>
                    </li>
                  )}
                </ul>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-200">
                  <span><i className="fas fa-download mr-1"></i>{product.delivery}</span>
                  <span><i className="fas fa-file mr-1"></i>{product.format}</span>
                </div>

                <button
                  onClick={() => state.user ? handlePurchase(product.id) : window.location.href = '/auth/signup'}
                  className="block w-full mt-4 py-2.5 rounded-xl text-white text-sm font-medium text-center transition-all"
                  style={{ backgroundColor: catCfg?.color || '#22c55e' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {state.user ? 'Purchase' : 'Sign in to Purchase'}
                </button>
              </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── BIG MODAL ─── */}
      {purchasing && currentProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setPurchasing(null)}>
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-10 text-center relative animate-in"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'fadeInUp 0.3s ease-out' }}
          >
            {/* Step 1: Thanks */}
            {purchasing.step === 'thanks' && (
              <>
                <div className="w-24 h-24 rounded-full bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-check text-5xl text-[#22c55e]"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  🎉 Thanks for Purchasing!
                </h2>
                <p className="text-gray-500 mb-1">
                  You just purchased:
                </p>
                <p className="font-semibold text-gray-800 text-lg mb-6">
                  {currentProduct.title}
                </p>
                <button
                  onClick={handleContinue}
                  className="w-full py-3 rounded-xl text-white text-base font-semibold transition-all bg-[#22c55e] hover:bg-[#16a34a]"
                >
                  Continue →
                </button>
                <p className="text-xs text-gray-400 mt-3">We'll send the file to your email</p>
              </>
            )}

            {/* Step 2: Sending */}
            {purchasing.step === 'sending' && (
              <>
                <div className="w-24 h-24 rounded-full bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-spinner fa-spin text-5xl text-[#22c55e]"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Sending to your email...
                </h2>
                <p className="text-gray-500">Please wait while we process your request.</p>
              </>
            )}

            {/* Error step */}
            {purchasing.step === 'error' && (
              <>
                <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-exclamation-triangle text-5xl text-red-500"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Something went wrong
                </h2>
                <p className="text-red-500 bg-red-50 rounded-xl p-3 text-sm mb-6">
                  {purchasing.message || 'An unknown error occurred.'}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPurchasing(null)}
                    className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 text-base font-medium hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleContinue}
                    className="flex-1 py-3 rounded-xl text-white text-base font-semibold bg-[#22c55e] hover:bg-[#16a34a]"
                  >
                    Try Again
                  </button>
                </div>
                <details className="mt-4 text-left">
                  <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">Troubleshooting tips</summary>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1 list-disc pl-4">
                    <li>Are you testing on <strong>localhost</strong>? Make sure the dev server is running (<code>npm run dev --webpack</code>)</li>
                    <li>Are you testing on <strong>Vercel</strong>? Add <code>SMTP_USER</code> and <code>SMTP_PASS</code> in Vercel Dashboard → Environment Variables</li>
                    <li>Check that your Gmail App Password is correct (16 characters, no spaces)</li>
                    <li>Your download is still available directly: <a href={`/store/download/${purchasing.productId}`} className="text-[#22c55e] underline">open download page</a></li>
                  </ul>
                </details>
              </>
            )}

            {/* Step 3: Sent */}
            {purchasing.step === 'sent' && (
              <>
                <div className="w-24 h-24 rounded-full bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-envelope-open-text text-5xl text-[#22c55e]"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  📬 Check Your Inbox!
                </h2>
                <p className="text-gray-500 bg-gray-50 rounded-xl p-3 text-sm mb-6">
                  {purchasing.message || 'Your file has been sent to your email.'}
                </p>
                <a
                  href={`/store/download/${purchasing.productId}`}
                  className="block w-full py-3 rounded-xl text-center text-white text-base font-semibold transition-all bg-[#22c55e] hover:bg-[#16a34a] mb-2"
                >
                  Open Download Page
                </a>
                <button
                  onClick={() => setPurchasing(null)}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
