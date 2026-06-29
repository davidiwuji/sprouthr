'use client';

import React from 'react';
import Link from 'next/link';

export default function CareerAdvicePage() {
  return (
    <div className="page-transition min-h-screen pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#22c55e] mb-8 transition-colors"><i className="fas fa-arrow-left text-sm"></i> Back to Home</Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Career Advice</h1>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p className="mb-6">Practical advice to help you navigate and grow in your career.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Building Your Personal Brand</h2>
          <p className="mb-4">Your professional reputation matters. Maintain an updated LinkedIn profile, engage with industry content, and network authentically.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Continuous Learning</h2>
          <p className="mb-4">The job market evolves rapidly. Invest in certifications, online courses, and workshops to stay competitive in your field.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Networking Strategies</h2>
          <p className="mb-4">Attend industry events, join professional associations, and connect with peers on platforms like LinkedIn. Many opportunities come through referrals.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Work-Life Balance</h2>
          <p className="mb-4">Set boundaries, prioritize tasks, and make time for rest. Sustainable career growth requires balance.</p>
        </div>
      </div>
    </div>
  );
}
