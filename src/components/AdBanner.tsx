'use client';

import React from 'react';
import Link from 'next/link';

interface AdBannerProps {
  /** 'horizontal' (default) for full-width banner, 'sidebar' for tall narrow, 'box' for square */
  variant?: 'horizontal' | 'sidebar' | 'box';
  /** Optional class name override */
  className?: string;
  /** An ad label/position hint (e.g. "Ad", "Sponsored") */
  label?: string;
}

const adSlots = [
  {
    text: 'Land your dream job with SPROUT',
    subtext: 'Browse thousands of verified opportunities',
    icon: 'fa-seedling',
    bg: 'from-[#22c55e]/10 to-[#16a34a]/5',
    href: '/browse',
  },
  {
    text: 'Get interview-ready with Past Questions',
    subtext: 'NNPC, Police, Banks, Oil & Gas & more',
    icon: 'fa-book-open',
    bg: 'from-[#3b82f6]/10 to-[#2563eb]/5',
    href: '/store',
  },
  {
    text: 'Professional CV Revamping',
    subtext: 'ATS-optimised templates that get you hired',
    icon: 'fa-file-pen',
    bg: 'from-[#f59e0b]/10 to-[#d97706]/5',
    href: '/cv-builder',
  },
  {
    text: 'AI Career Mentors Available',
    subtext: 'Get personalised guidance 24/7',
    icon: 'fa-robot',
    bg: 'from-[#8b5cf6]/10 to-[#7c3aed]/5',
    href: '/mentor',
  },
  {
    text: 'Employers: Post your vacancies',
    subtext: 'Reach top talent across Nigeria',
    icon: 'fa-building',
    bg: 'from-[#ef4444]/10 to-[#dc2626]/5',
    href: '/for-employers',
  },
  {
    text: 'Scholarships & Fellowships',
    subtext: 'Fund your education with verified grants',
    icon: 'fa-graduation-cap',
    bg: 'from-[#14b8a6]/10 to-[#0d9488]/5',
    href: '/scholarships',
  },
  {
    text: 'Internships for Graduates',
    subtext: 'Kickstart your career with top firms',
    icon: 'fa-laptop-code',
    bg: 'from-[#ec4899]/10 to-[#db2777]/5',
    href: '/internships',
  },
  {
    text: 'Graduate Training Programs',
    subtext: 'Structured programs for fresh graduates',
    icon: 'fa-user-graduate',
    bg: 'from-[#6366f1]/10 to-[#4f46e5]/5',
    href: '/graduate-programs',
  },
];

export default function AdBanner({
  variant = 'horizontal',
  className = '',
  label = 'Advertisement',
}: AdBannerProps) {
  const slot = adSlots[Math.floor(Math.random() * adSlots.length)];
  const Comp = slot.href.startsWith('http') ? 'a' : Link;
  const linkProps = slot.href.startsWith('http')
    ? { href: slot.href, target: '_blank', rel: 'noopener noreferrer' }
    : { href: slot.href };

  if (variant === 'sidebar') {
    return (
      <Comp
        {...linkProps}
        className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all hover:shadow-md block group ${className}`}
      >
        <div className={`bg-gradient-to-br ${slot.bg} p-6 flex flex-col items-center text-center min-h-[280px]`}>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">{label}</span>
          <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
            <i className={`fas ${slot.icon} text-xl text-gray-700`}></i>
          </div>
          <h4 className="text-sm font-semibold text-gray-800 mb-1">{slot.text}</h4>
          <p className="text-xs text-gray-500">{slot.subtext}</p>
        </div>
      </Comp>
    );
  }

  if (variant === 'box') {
    return (
      <Comp
        {...linkProps}
        className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all hover:shadow-md block group ${className}`}
      >
        <div className={`bg-gradient-to-br ${slot.bg} p-6 flex flex-col items-center text-center`}>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">{label}</span>
          <div className="w-14 h-14 rounded-2xl bg-white/80 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
            <i className={`fas ${slot.icon} text-2xl text-gray-700`}></i>
          </div>
          <h4 className="font-semibold text-gray-800 mb-1">{slot.text}</h4>
          <p className="text-xs text-gray-500">{slot.subtext}</p>
        </div>
      </Comp>
    );
  }

  // Horizontal (default)
  return (
    <Comp
      {...linkProps}
      className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all hover:shadow-md block group ${className}`}
    >
      <div className={`bg-gradient-to-r ${slot.bg} px-6 py-4 flex items-center gap-4`}>
        <span className="text-[10px] uppercase tracking-widest text-gray-400">{label}</span>
        <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
          <i className={`fas ${slot.icon} text-lg text-gray-700`}></i>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-800 truncate">{slot.text}</h4>
          <p className="text-xs text-gray-500 truncate">{slot.subtext}</p>
        </div>
        <i className="fas fa-arrow-right text-gray-400 group-hover:text-[#22c55e] group-hover:translate-x-1 transition-all"></i>
      </div>
    </Comp>
  );
}
