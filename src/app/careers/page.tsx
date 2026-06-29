'use client';

import React from 'react';
import Link from 'next/link';

export default function CareersPage() {
  return (
    <div className="page-transition min-h-screen pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#22c55e] mb-8 transition-colors"><i className="fas fa-arrow-left text-sm"></i> Back to Home</Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Careers at SPROUTHR</h1>
        <p className="text-lg text-gray-600 mb-8">Join our mission to transform how talent connects with opportunity across Africa. We're building a platform that makes career discovery accessible to everyone.</p>
        <div className="glass rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Work With Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: 'fa-globe', title: 'Remote-First', desc: 'Work from anywhere in the world' },
              { icon: 'fa-chart-line', title: 'Growth', desc: 'Learning budget and career development' },
              { icon: 'fa-hand-holding-heart', title: 'Impact', desc: 'Directly help people find career opportunities' },
              { icon: 'fa-users', title: 'Culture', desc: 'Collaborative, diverse, and inclusive team' },
            ].map(b => (
              <div key={b.title} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 flex items-center justify-center shrink-0 mt-1"><i className={`fas ${b.icon} text-[#22c55e]`}></i></div>
                <div><h4 className="font-medium text-gray-900">{b.title}</h4><p className="text-sm text-gray-500">{b.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-8 text-center">
          <i className="fas fa-file-pen text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Open Positions Right Now</h3>
          <p className="text-gray-500">We're always looking for great talent. Send your CV to <a href="mailto:careers@sprouthr.com" className="text-[#22c55e] hover:underline">careers@sprouthr.com</a></p>
        </div>
      </div>
    </div>
  );
}
