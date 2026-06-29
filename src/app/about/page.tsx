'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="page-transition min-h-screen pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#22c55e] mb-8 transition-colors"><i className="fas fa-arrow-left text-sm"></i> Back to Home</Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>About SPROUTHR</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-gray-600 mb-6">SPROUTHR is a career opportunity platform dedicated to connecting talent with opportunities across Africa and beyond. We believe that everyone deserves access to the right career path — whether that's a job, internship, scholarship, fellowship, or volunteer position.</p>
          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">To democratize access to career opportunities by providing a single, intuitive platform where individuals can discover, apply for, and track opportunities that match their skills, interests, and career goals.</p>
          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">Our Vision</h2>
          <p className="text-gray-600 mb-6">A world where every individual — regardless of background, location, or network — can find and seize the opportunities that unlock their full potential.</p>
          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {[
              { icon: 'fa-hand-holding-heart', title: 'Inclusivity', desc: 'We believe opportunity should be accessible to everyone, everywhere.' },
              { icon: 'fa-lightbulb', title: 'Innovation', desc: 'We leverage technology to simplify and enhance the job-seeking experience.' },
              { icon: 'fa-shield-alt', title: 'Trust', desc: 'We verify opportunities and protect our users\' data and privacy.' },
              { icon: 'fa-rocket', title: 'Impact', desc: 'We measure our success by the careers launched and lives transformed.' },
            ].map(v => (
              <div key={v.title} className="glass rounded-2xl p-6">
                <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 flex items-center justify-center mb-4"><i className={`fas ${v.icon} text-[#22c55e] text-lg`}></i></div>
                <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
