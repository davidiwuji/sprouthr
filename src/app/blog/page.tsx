'use client';

import React from 'react';
import Link from 'next/link';

const articles = [
  { title: 'How to Land Your Dream Job in 2026', date: 'June 15, 2026', excerpt: 'Practical tips on networking, resume building, and interview prep for today\'s competitive job market.' },
  { title: 'Top 10 High-Demand Careers in Nigeria', date: 'June 10, 2026', excerpt: 'Discover which industries are hiring and the skills you need to stand out.' },
  { title: 'Remote Work: Pros, Cons & How to Get Started', date: 'June 5, 2026', excerpt: 'Everything you need to know about landing and succeeding in a remote role.' },
  { title: 'Graduate Program Applications: A Step-by-Step Guide', date: 'May 28, 2026', excerpt: 'From research to acceptance — navigate the graduate program process with confidence.' },
  { title: 'Scholarship Application Tips That Actually Work', date: 'May 20, 2026', excerpt: 'Learn how to craft a compelling scholarship application that stands out to reviewers.' },
];

export default function BlogPage() {
  return (
    <div className="page-transition min-h-screen pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#22c55e] mb-8 transition-colors"><i className="fas fa-arrow-left text-sm"></i> Back to Home</Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Blog</h1>
        <p className="text-gray-500 mb-10">Career insights, tips, and updates from the SPROUTHR team.</p>
        <div className="space-y-6">
          {articles.map((a, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 card-hover border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">{a.date}</p>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{a.title}</h2>
              <p className="text-sm text-gray-500">{a.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
