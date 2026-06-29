'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, send to Supabase or an API endpoint
    setSent(true);
  };

  return (
    <div className="page-transition min-h-screen pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#22c55e] mb-8 transition-colors"><i className="fas fa-arrow-left text-sm"></i> Back to Home</Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-space" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Contact Us</h1>
        <p className="text-gray-500 mb-12 text-lg">Have a question, feedback, or want to partner with us? We'd love to hear from you.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="glass rounded-2xl p-8">
              {sent ? (
                <div className="text-center py-12">
                  <i className="fas fa-check-circle text-5xl text-[#22c55e] mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500">We'll get back to you within 24-48 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Your Name" required className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] transition-colors" /></div>
                    <div><input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="Your Email" required className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] transition-colors" /></div>
                  </div>
                  <div><input value={form.subject} onChange={e => setForm(p => ({...p, subject: e.target.value}))} placeholder="Subject" required className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] transition-colors" /></div>
                  <div><textarea value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} placeholder="Your Message" rows={5} required className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#22c55e] transition-colors resize-none"></textarea></div>
                  <button type="submit" className="w-full py-3.5 rounded-xl bg-[#22c55e] text-white font-semibold hover:bg-[#16a34a] transition-all"><i className="fas fa-paper-plane mr-2"></i> Send Message</button>
                </form>
              )}
            </div>
          </div>
          <div className="space-y-6">
            {[
              { icon: 'fa-envelope', title: 'Email', desc: 'hello@sprouthr.com', href: 'mailto:hello@sprouthr.com' },
              { icon: 'fa-map-marker-alt', title: 'Location', desc: 'Lagos, Nigeria', href: null },
              { icon: 'fa-clock', title: 'Response Time', desc: 'Within 24-48 hours', href: null },
              { icon: 'fa-comment', title: 'Live Chat', desc: 'Available Mon-Fri, 9AM-5PM WAT', href: null },
            ].map(item => (
              <div key={item.title} className="glass rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 flex items-center justify-center"><i className={`fas ${item.icon} text-[#22c55e]`}></i></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    {item.href ? <a href={item.href} className="text-sm text-[#22c55e] hover:underline">{item.desc}</a> : <p className="text-sm text-gray-500">{item.desc}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
