'use client';

import React from 'react';
import Link from 'next/link';

export default function CookiesPage() {
  return (
    <div className="page-transition min-h-screen pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#22c55e] mb-8 transition-colors"><i className="fas fa-arrow-left text-sm"></i> Back to Home</Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Cookie Policy</h1>
        <div className="prose prose-gray max-w-none text-gray-600">
          <p className="mb-4">Last updated: January 2026</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">What Are Cookies</h2>
          <p className="mb-4">Cookies are small text files stored on your device when you visit a website. They help us improve your experience by remembering your preferences and understanding how you use our platform.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">How We Use Cookies</h2>
          <p className="mb-4">SPROUTHR uses cookies for the following purposes:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for the platform to function properly, including authentication and session management.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform so we can improve it.</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences for future visits.</li>
          </ul>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Managing Cookies</h2>
          <p className="mb-4">You can control cookies through your browser settings. Disabling certain cookies may affect the functionality of the platform. Most browsers allow you to block or delete cookies through their settings menu.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Third-Party Cookies</h2>
          <p className="mb-4">We may use third-party services (such as analytics providers) that set their own cookies. These cookies are governed by the respective third-party privacy policies.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Changes to This Policy</h2>
          <p className="mb-4">We may update this Cookie Policy from time to time. We will notify you of any significant changes by posting a notice on our platform.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Contact</h2>
          <p className="mb-4">If you have questions about our Cookie Policy, please contact us at <a href="mailto:privacy@sprouthr.com" className="text-[#22c55e] hover:underline">privacy@sprouthr.com</a>.</p>
        </div>
      </div>
    </div>
  );
}
