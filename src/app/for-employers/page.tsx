'use client';

import React from 'react';
import Link from 'next/link';

export default function ForEmployersPage() {
  return (
    <div className="page-transition min-h-screen pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#22c55e] mb-8 transition-colors"><i className="fas fa-arrow-left text-sm"></i> Back to Home</Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>For Employers</h1>
        <p className="text-lg text-gray-600 mb-8">Find the best talent for your organization. SPROUTHR connects you with qualified candidates across various fields and experience levels.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: 'fa-bullhorn', title: 'Post Jobs', desc: 'Reach thousands of active job seekers' },
            { icon: 'fa-search', title: 'Search Talent', desc: 'Browse CVs and find the perfect match' },
            { icon: 'fa-chart-bar', title: 'Analytics', desc: 'Track application performance' },
          ].map(f => (
            <div key={f.title} className="glass rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-4"><i className={`fas ${f.icon} text-[#22c55e] text-lg`}></i></div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="glass rounded-2xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Interested in Partnering With Us?</h3>
          <p className="text-gray-500 mb-6">Send us an email and we'll get back to you within 24 hours.</p>
          <a href="mailto:employers@sprouthr.com" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#22c55e] text-white font-semibold hover:bg-[#16a34a] transition-all">
            <i className="fas fa-envelope"></i> employers@sprouthr.com
          </a>
        </div>
      </div>
    </div>
  );
}
