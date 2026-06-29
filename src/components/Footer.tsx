'use client';

import { useApp } from '@/lib/AppContext';
import Link from 'next/link';

export default function Footer() {
  const { navigateTo } = useApp();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      {/* Telegram + WhatsApp CTA Banner */}
      <div className="bg-gradient-to-r from-[#22c55e] to-[#14b8a6] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 text-white">
            <i className="fab fa-telegram-plane text-2xl"></i>
            <span className="font-medium">Join our community for exclusive opportunities!</span>
          </div>
          <div className="flex gap-3">
            <a
              href="https://t.me/sprouthr"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-xl bg-white text-[#22c55e] font-semibold text-sm hover:bg-white/90 transition-all flex items-center gap-2"
            >
              <i className="fab fa-telegram-plane"></i> Telegram
            </a>
            <a
              href="https://wa.me/message/YOUR_WA_LINK"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-xl bg-white/20 text-white font-semibold text-sm hover:bg-white/30 transition-all flex items-center gap-2 border border-white/40"
            >
              <i className="fab fa-whatsapp"></i> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#22c55e] flex items-center justify-center">
                <i className="fas fa-seedling text-white text-sm"></i>
              </div>
              <span className="text-lg font-bold font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                SPROUT<span className="text-[#22c55e]">HR</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 mb-4">Every Opportunity, One Platform. Discover your next career move with SPROUTHR.</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { href: 'https://t.me/sprouthr', icon: 'fa-telegram', hoverColor: '#0088cc' },
                { href: 'https://wa.me/message/YOUR_WA_LINK', icon: 'fa-whatsapp', hoverColor: '#25D366' },
                { href: 'https://twitter.com', icon: 'fa-twitter' },
                { href: 'https://linkedin.com', icon: 'fa-linkedin-in' },
                { href: 'https://instagram.com', icon: 'fa-instagram' },
              ].map(s => (
                <a key={s.icon} href={s.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:text-[#22c55e] hover:border-[#22c55e] border border-transparent transition-all">
                  <i className={`fab ${s.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Opportunities</h4>
            <ul className="space-y-2">
              <li><Link href="/jobs" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">Jobs</Link></li>
              <li><Link href="/internships" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">Internships</Link></li>
              <li><Link href="/scholarships" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">Scholarships</Link></li>
              <li><Link href="/fellowships" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">Fellowships</Link></li>
              <li><Link href="/bootcamps" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">Bootcamps</Link></li>
              <li><Link href="/grants" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">Grants</Link></li>
              <li><Link href="/volunteer" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">Volunteer</Link></li>
              <li><Link href="/graduate-programs" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">Graduate Programs</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">Blog</Link></li>
              <li><Link href="/cv-tips" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">CV Tips</Link></li>
              <li><Link href="/interview-guide" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">Interview Guide</Link></li>
              <li><Link href="/career-advice" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">Career Advice</Link></li>
              <li><Link href="/salary-guide" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">Salary Guide</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">Contact</Link></li>
              <li><Link href="/for-employers" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">For Employers</Link></li>
              <li><Link href="/careers" className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors">Careers</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; {currentYear} SPROUTHR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
