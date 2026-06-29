'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="page-transition min-h-screen pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#22c55e] mb-8 transition-colors"><i className="fas fa-arrow-left text-sm"></i> Back to Home</Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Terms and Conditions</h1>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p className="mb-4">Last updated: January 2026</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Acceptance of Terms</h2>
          <p className="mb-4">By accessing or using SPROUTHR (&quot;the Platform&quot;), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Platform.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Description of Service</h2>
          <p className="mb-4">SPROUTHR provides a platform for users to discover career opportunities including jobs, internships, scholarships, fellowships, and other professional development resources. The Platform also offers CV building tools, mentorship services, and career preparation resources.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">User Responsibilities</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Provide accurate and complete information when creating an account</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Use the Platform in compliance with all applicable laws and regulations</li>
            <li>Not engage in any activity that disrupts or interferes with the Platform</li>
          </ul>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Intellectual Property</h2>
          <p className="mb-4">All content on the Platform, including text, graphics, logos, and software, is the property of SPROUTHR or its content providers and is protected by applicable intellectual property laws.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Limitation of Liability</h2>
          <p className="mb-4">SPROUTHR shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform. We provide the Platform on an &quot;as is&quot; and &quot;as available&quot; basis.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Changes to Terms</h2>
          <p className="mb-4">We reserve the right to modify these terms at any time. Users will be notified of material changes via email or a notice on the Platform.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Contact</h2>
          <p className="mb-4">For questions about these Terms, please contact us at <a href="mailto:support@sprouthr.com" className="text-[#22c55e] hover:underline">support@sprouthr.com</a>.</p>
        </div>
      </div>
    </div>
  );
}
