'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SUPER_ADMIN_EMAILS = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL 
  ? [process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL] 
  : ['davidiwuji1@gmail.com'];

export default function Navbar() {
  const { state, showToast, navigateTo, signOut } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const isSuperAdmin = state.user && SUPER_ADMIN_EMAILS.includes(state.user.email || '');
  const isAdminUser = state.user && (
    isSuperAdmin || state.user.user_metadata?.is_admin === true
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(path));

  const handleNavClick = (e: React.MouseEvent, page: string) => {
    if (!state.user && ['/employer', '/cv-builder', '/admin'].includes(page)) {
      e.preventDefault();
      showToast('Please sign in to access this page', 'info');
      navigateTo('auth/signup');
    }
  };

  const userInitials = state.user?.email?.slice(0, 2).toUpperCase() || '?';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={state.user ? '/dashboard' : '/'} className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#22c55e] flex items-center justify-center">
              <i className="fas fa-seedling text-white text-sm"></i>
            </div>
            <span className="text-base md:text-lg font-bold font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              SPROUT<span className="text-[#22c55e]">HR</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href={state.user ? '/dashboard' : '/'} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive(state.user ? '/dashboard' : '/') && !isActive('/browse') && !isActive('/store') && !isActive('/mentor') && !isActive('/employer') && !isActive('/admin')
                ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}>
              Home
            </Link>
            <Link href="/browse" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive('/browse') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}>
              Jobs
            </Link>
            <Link href="/store" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive('/store') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}>
              Store
            </Link>
            <Link href="/mentor" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive('/mentor') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}>
              Mentor
            </Link>
            <Link
              href="/employer"
              onClick={handleNavClick}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/employer') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              For Employers
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Community link */}
            <a
              href="https://t.me/sprouthr"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f59e0b]/10 text-[#f59e0b] text-sm font-medium hover:bg-[#f59e0b]/20 transition-all"
              title="Join our Telegram community"
            >
              <i className="fab fa-telegram-plane"></i>
              <span className="hidden lg:inline">Community</span>
            </a>

            {/* Admin link - show to super admins & admins */}
            {isAdminUser && (
              <Link href="/admin" className="hidden sm:flex text-gray-400 hover:text-gray-600 transition-colors text-sm" title="Admin Dashboard">
                <i className="fas fa-shield-halved"></i>
              </Link>
            )}

            {/* Notifications — only if logged in */}
            {state.user && (
              <button
                onClick={() => {
                  if (state.toasts.length > 0) {
                    // Open a toast view by showing the most recent one
                    showToast(state.toasts[state.toasts.length - 1].message, state.toasts[state.toasts.length - 1].type);
                  } else {
                    showToast('No new notifications', 'info');
                  }
                }}
                className="relative text-gray-500 hover:text-gray-900 transition-colors"
                title="Notifications"
              >
                <i className="fas fa-bell"></i>
                {state.toasts.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-medium">
                    {state.toasts.length}
                  </span>
                )}
              </button>
            )}

            {/* Auth buttons or User Dropdown */}
            {!state.user ? (
              <div className="flex items-center gap-2">
                <Link href="/auth/signup" className="px-5 py-2 rounded-xl bg-[#22c55e] text-white text-sm font-medium hover:bg-[#16a34a] transition-all shadow-sm">
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#22c55e] flex items-center justify-center text-white text-xs font-bold">
                    {userInitials}
                  </div>
                  <i className="fas fa-chevron-down text-xs text-gray-400"></i>
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{state.user.email}</p>
                        <p className="text-xs text-gray-400">{
                          isSuperAdmin ? 'Super Admin' : isAdminUser ? 'Admin' : 'Job Seeker'
                        }</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                        <i className="fas fa-columns w-4 text-gray-400"></i> Dashboard
                      </Link>
                      <Link href="/cv-builder" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                        <i className="fas fa-file-pen w-4 text-gray-400"></i> CV Builder
                      </Link>
                      <Link href="/store" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                        <i className="fas fa-store w-4 text-gray-400"></i> Store
                      </Link>
                      {isAdminUser && (
                        <Link href="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100">
                          <i className="fas fa-shield-halved w-4 text-gray-400"></i> Admin Panel
                        </Link>
                      )}
                      <button onClick={() => { setDropdownOpen(false); signOut(); }} className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full border-t border-gray-100">
                        <i className="fas fa-sign-out-alt w-4"></i> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-500 hover:text-gray-900 p-2"
            >
              <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {state.user ? (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Home</Link>
            ) : (
              <Link href="/" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Home</Link>
            )}
            <Link href="/browse" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Jobs</Link>
            <Link href="/store" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Store</Link>
            <Link href="/mentor" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Mentor</Link>
            <Link href="/employer" onClick={(e) => { setMobileOpen(false); handleNavClick(e, '/employer'); }} className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">For Employers</Link>
            {!state.user && (
              <Link href="/auth/signup" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium bg-[#22c55e] text-white text-center mt-2">
                Get Started
              </Link>
            )}
            {state.user && (
              <button
                onClick={() => { setMobileOpen(false); signOut(); }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full"
              >
                <i className="fas fa-sign-out-alt"></i> Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
