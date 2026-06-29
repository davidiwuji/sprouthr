'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AppProvider } from '@/lib/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToastContainer from '@/components/ToastContainer';
import BackToTop from '@/components/BackToTop';
import AdBanner from '@/components/AdBanner';

const NO_AD_PAGES = ['/admin', '/employer', '/dashboard'];
const LANDING_PAGE = '/';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === LANDING_PAGE;
  const isBrowse = pathname === '/browse';
  const noAds = NO_AD_PAGES.some(p => pathname?.startsWith(p));
  const showAds = !noAds;
  const showLandscape = showAds && !isLanding && !isBrowse;      // no top landscape on landing or browse (browse has its own ad placement)
  const showLeftSide = showAds && !isLanding && !isBrowse;        // left ads disturb the landing image and browse layout
  const showRightSide = showAds;                     // right ads ok everywhere

  return (
    <AppProvider>
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Landscape banner under navbar (not on landing page) */}
        {showLandscape && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <AdBanner variant="horizontal" />
          </div>
        )}

        {children}
      </main>

      {/* ─── LEFT SIDE: two stacked skyscraper ads (wider) ─── */}
      {showLeftSide && (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 w-[180px] hidden xl:flex flex-col gap-3 z-40 pointer-events-none">
          <div className="pointer-events-auto"><AdBanner variant="sidebar" /></div>
          <div className="pointer-events-auto"><AdBanner variant="sidebar" /></div>
        </div>
      )}

      {/* ─── RIGHT SIDE: two stacked skyscraper ads (wider, shown everywhere) ─── */}
      {showRightSide && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 w-[180px] hidden xl:flex flex-col gap-3 z-40 pointer-events-none">
          <div className="pointer-events-auto"><AdBanner variant="sidebar" /></div>
          <div className="pointer-events-auto"><AdBanner variant="sidebar" /></div>
        </div>
      )}

      {/* ─── BOTTOM banner (only on landing page, before footer) ─── */}
      {isLanding && showAds && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <AdBanner variant="horizontal" />
        </div>
      )}

      <Footer />
      <ToastContainer />
      <BackToTop />
    </AppProvider>
  );
}
