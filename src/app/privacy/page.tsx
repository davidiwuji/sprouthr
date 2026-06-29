'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="page-transition min-h-screen pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#22c55e] mb-8 transition-colors"><i className="fas fa-arrow-left text-sm"></i> Back to Home</Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Privacy Policy</h1>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p className="mb-4">Last updated: January 2026</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Introduction</h2>
          <p className="mb-4">SPROUTHR (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our platform.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Information We Collect</h2>
          <p className="mb-4">We collect information you provide directly to us, including:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Account Information:</strong> Name, email address, phone number, and password when you create an account.</li>
            <li><strong>Profile Information:</strong> Location, role, CV/resume data, and preferences you choose to share.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our platform, including pages visited and features used.</li>
          </ul>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">How We Use Your Information</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>To provide and maintain our platform</li>
            <li>To personalize your experience and recommend relevant opportunities</li>
            <li>To communicate with you about updates, opportunities, and support</li>
            <li>To improve our platform based on usage patterns</li>
          </ul>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Data Security</h2>
          <p className="mb-4">We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Contact</h2>
          <p className="mb-4">If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@sprouthr.com" className="text-[#22c55e] hover:underline">privacy@sprouthr.com</a>.</p>
        </div>
      </div>
    </div>
  );
}
