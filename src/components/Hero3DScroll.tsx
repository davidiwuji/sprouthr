'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface Props {
  user?: any;
}

export default function Hero3DScroll({ user }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (-rect.top) / window.innerHeight));
      setProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const contentOpacity = Math.max(0, 1 - progress * 1.8);
  const yOffset = progress * 60;

  return (
    <div ref={sectionRef} className="relative min-h-screen">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#f0f2f5] flex items-center">
        <div className="flex w-full h-full">
          {/* LEFT: Image — touches left edge */}
          <div className="hidden lg:flex w-[55%] h-full items-center justify-center overflow-hidden">
            <img
              src="/Landing.png"
              alt="SPROUTHR — Career opportunities"
              className="w-full h-full object-cover object-left"
            />
          </div>

          {/* RIGHT: Content */}
          <div
            className="flex-1 flex items-center"
            style={{
              opacity: contentOpacity,
              transform: `translateY(${yOffset}px)`,
              transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
          >
            <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-16">
              <div className="max-w-xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Your Opportunities,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] to-[#4ade80]">
                    One Platform
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-gray-500 max-w-xl mb-8">
                  Discover jobs, internships, scholarships, fellowships, grad programs, and volunteer roles — all in one place. Your career journey starts here.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link
                    href={user ? '/dashboard' : '/browse'}
                    className="px-8 py-3.5 rounded-xl accent-gradient text-white font-semibold text-base hover:shadow-lg hover:shadow-[#22c55e]/25 transition-all duration-300"
                  >
                    <i className="fas fa-rocket mr-2"></i>
                    {user ? 'Go to Dashboard' : 'Explore Opportunities'}
                  </Link>

                  {!user && (
                    <Link
                      href="/auth/signup"
                      className="px-8 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-base hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all duration-300"
                    >
                      <i className="fas fa-user-plus mr-2"></i>
                      Get Started
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile image (visible below lg) */}
        <div className="lg:hidden absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/Landing.png"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-500 z-10"
          style={{ opacity: Math.max(0, 1 - progress * 4) }}
        >
          <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-gray-300 flex justify-center">
            <div className="w-1 h-2.5 rounded-full bg-[#22c55e] mt-1 animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
