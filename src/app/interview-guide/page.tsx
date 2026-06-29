'use client';

import React from 'react';
import Link from 'next/link';

export default function InterviewGuidePage() {
  return (
    <div className="page-transition min-h-screen pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#22c55e] mb-8 transition-colors"><i className="fas fa-arrow-left text-sm"></i> Back to Home</Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Interview Guide</h1>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p className="mb-6">Ace your next interview with our comprehensive guide.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Before the Interview</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Research the company:</strong> Understand their mission, values, products, and recent news.</li>
            <li><strong>Review the job description:</strong> Prepare examples that demonstrate each requirement.</li>
            <li><strong>Practice common questions:</strong> Prepare answers for &quot;Tell me about yourself&quot; and &quot;Why do you want this role?&quot;</li>
            <li><strong>Prepare questions to ask:</strong> Show genuine interest by asking thoughtful questions about the role and team.</li>
          </ul>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">During the Interview</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Be punctual:</strong> Join the call or arrive 5–10 minutes early.</li>
            <li><strong>Use the STAR method:</strong> Structure answers using Situation, Task, Action, Result.</li>
            <li><strong>Stay positive:</strong> Even when discussing challenges, focus on what you learned.</li>
            <li><strong>Listen carefully:</strong> Make sure you understand each question before answering.</li>
          </ul>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">After the Interview</h2>
          <p className="mb-4">Send a thank-you email within 24 hours. Reiterate your interest and briefly mention a key point from the conversation.</p>
        </div>
      </div>
    </div>
  );
}
