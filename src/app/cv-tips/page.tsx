'use client';

import React from 'react';
import Link from 'next/link';

export default function CVTipsPage() {
  return (
    <div className="page-transition min-h-screen pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#22c55e] mb-8 transition-colors"><i className="fas fa-arrow-left text-sm"></i> Back to Home</Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>CV Tips</h1>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p className="mb-6">Your CV is your first impression. Make it count with these expert tips.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">1. Keep It Concise</h2>
          <p className="mb-4">Aim for one to two pages. Recruiters spend an average of 7 seconds scanning a CV — make every word count.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">2. Tailor for Each Role</h2>
          <p className="mb-4">Customize your CV for each application. Highlight the skills and experience most relevant to the specific position.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">3. Use Strong Action Verbs</h2>
          <p className="mb-4">Start bullet points with words like &quot;Developed,&quot; &quot;Led,&quot; &quot;Implemented,&quot; or &quot;Optimized&quot; to demonstrate impact.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">4. Quantify Achievements</h2>
          <p className="mb-4">Use numbers to back up your accomplishments. &quot;Increased sales by 30%&quot; is more powerful than &quot;Increased sales.&quot;</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">5. ATS Optimization</h2>
          <p className="mb-4">Many companies use Applicant Tracking Systems. Use keywords from the job description to ensure your CV gets past automated filters.</p>
          <p className="mt-8">Use our <Link href="/cv-builder" className="text-[#22c55e] hover:underline">CV Builder</Link> to create a professional, ATS-optimized CV in minutes.</p>
        </div>
      </div>
    </div>
  );
}
