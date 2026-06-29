'use client';

import React from 'react';
import Link from 'next/link';

export default function EmployerPage() {
  return (
    <div className="page-transition min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo image */}
        <div className="relative mb-10 max-w-xl mx-auto">
          <img
            src="/Logo.png"
            alt="SPROUTHR Employers"
            className="w-full h-auto"
          />
        </div>

        {/* Coming Soon badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#22c55e]/10 text-[#22c55e] text-sm font-medium mb-6">
          <i className="fas fa-clock"></i>
          <span>Coming Soon</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-space mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Employer Portal
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
          We&apos;re building a powerful platform for employers to post opportunities,
          review candidates, and find the best talent across Nigeria.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/for-employers" className="px-6 py-3 rounded-xl accent-gradient text-white font-medium">
            <i className="fas fa-info-circle mr-2"></i>Learn More
          </Link>
          <Link href="/browse" className="px-6 py-3 rounded-xl glass text-gray-700 font-medium">
            <i className="fas fa-briefcase mr-2"></i>Browse Jobs
          </Link>
        </div>

        {/* Feature preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
          {[
            { icon: 'fa-plus-circle', title: 'Post Jobs', desc: 'List unlimited opportunities' },
            { icon: 'fa-users', title: 'Find Talent', desc: 'Browse qualified candidates' },
            { icon: 'fa-chart-line', title: 'Insights', desc: 'Track views & applications' },
          ].map(f => (
            <div key={f.title} className="glass rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-4">
                <i className={`fas ${f.icon} text-[#22c55e]`}></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
