'use client';

import React from 'react';
import Link from 'next/link';

export default function SalaryGuidePage() {
  return (
    <div className="page-transition min-h-screen pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#22c55e] mb-8 transition-colors"><i className="fas fa-arrow-left text-sm"></i> Back to Home</Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Salary Guide</h1>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p className="mb-6">Understand salary expectations across various industries and experience levels in Nigeria.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Entry Level (0–2 years)</h2>
          <p className="mb-4">Typical range: ₦800,000 – ₦2,500,000 per year depending on industry and location.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Mid Level (3–5 years)</h2>
          <p className="mb-4">Typical range: ₦2,500,000 – ₦6,000,000 per year. Specialized skills and certifications can increase earning potential.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Senior Level (6–10 years)</h2>
          <p className="mb-4">Typical range: ₦6,000,000 – ₦15,000,000 per year. Leadership roles and niche expertise command premium compensation.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Executive Level (10+ years)</h2>
          <p className="mb-4">Typical range: ₦15,000,000+ per year, plus benefits, bonuses, and equity packages.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Industry Highlights</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Oil & Gas:</strong> Among the highest-paying sectors, especially for engineering and management roles.</li>
            <li><strong>Banking & Finance:</strong> Competitive salaries with strong bonus structures.</li>
            <li><strong>Technology:</strong> Rapidly growing salaries, especially for software development, data science, and cybersecurity.</li>
            <li><strong>Healthcare:</strong> Specialized medical professionals earn premium rates.</li>
          </ul>
          <p className="mt-6 text-sm text-gray-400">Note: These are estimates and may vary based on company size, location, and market conditions.</p>
        </div>
      </div>
    </div>
  );
}
