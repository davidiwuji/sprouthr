'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { storeProducts, categoryConfig, type StoreCategory } from '@/data/store';
import Link from 'next/link';

export default function StorePage() {
  const { navigateTo, state } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const categoryOrder: (StoreCategory | 'all')[] = [
    'all',
    'federal-govt',
    'military',
    'oil-gas',
    'teaching',
    'banking',
    'graduate',
    'medical',
    'private',
    'engineering',
    'general',
    'cv-service',
    'mentorship',
  ];
  const categories = categoryOrder.filter(c => c === 'all' || storeProducts.some(p => p.category === c));

  const filtered = storeProducts.filter(p => {
    const matchCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const [expandedFeatures, setExpandedFeatures] = useState<Set<number>>(new Set());

  const toggleFeatures = (id: number) => {
    setExpandedFeatures(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
                  onClick={() => navigateTo(state.user ? 'checkout' : 'auth/signup')}
                  className="w-full mt-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all" style={{ backgroundColor: catCfg?.color || '#22c55e' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {state.user ? 'Purchase Now' : 'Sign in to Purchase'}
                </button>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
