'use client';

import React from 'react';
import Link from 'next/link';

const faqs = [
  { q: 'How do I create an account?', a: 'Click "Get Started" in the top right corner, fill in your details, and verify your email address to create your free SPROUTHR account.' },
  { q: 'Is SPROUTHR free to use?', a: 'Yes! Browsing opportunities and creating an account are completely free. Some premium features like CV templates and mentorship sessions may have associated costs.' },
  { q: 'How do I apply for a job?', a: 'Click on any opportunity to view details, then click the "Apply Now" button. This will open your default email client with a pre-composed message.' },
  { q: 'How do I save jobs for later?', a: 'Click the bookmark icon on any opportunity card to save it. You can view all your saved jobs in your Dashboard under the "Saved" tab.' },
  { q: 'How does the AI Mentor work?', a: 'Our AI mentors specialize in different career areas. Navigate to the Mentor page, choose a mentor, and ask questions related to their domain.' },
  { q: 'Can I build my CV on SPROUTHR?', a: 'Yes! Use our CV Builder to create a professional CV. Basic templates are free, and premium templates offer more advanced formatting.' },
  { q: 'How do I contact support?', a: 'Visit our Contact page or email us at support@sprouthr.com. We typically respond within 24 hours.' },
  { q: 'How often are new opportunities posted?', a: 'Opportunities are updated daily through our automated job scraping system, ensuring you have access to the latest listings.' },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className="page-transition min-h-screen pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#22c55e] mb-8 transition-colors"><i className="fas fa-arrow-left text-sm"></i> Back to Home</Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>FAQ</h1>
        <p className="text-gray-500 mb-10">Frequently asked questions about SPROUTHR.</p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                <i className={`fas fa-chevron-down text-gray-400 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}></i>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-gray-500 text-sm border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
