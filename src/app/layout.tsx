import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "SproutHR - Every Opportunity, One Platform",
  description: "Jobs, Internships, Scholarships, Fellowships & More — tailored to where you are in your career journey.",
  icons: {
    icon: [
      { url: '/Logo.png', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'manifest', url: '/favicon/site.webmanifest' },
    ],
  },
};

// Inline CSS fallback for dev mode where PostCSS pipeline can't serve compiled CSS
const fallbackStyles = `
:root {
  --accent-green: #22c55e;
  --accent-green-dark: #16a34a;
  --accent-green-light: #4ade80;
  --bg-primary: #f0f2f5;
  --bg-surface: #ffffff;
  --bg-card: #ffffff;
  --bg-border: #e2e8f0;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;
  --coral: #ef4444;
  --gold: #f59e0b;
  --teal: #14b8a6;
  --orange: #f97316;
}
* { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; }
body { font-family:'DM Sans',sans-serif; background-color:var(--bg-primary); color:var(--text-primary); min-height:100vh; line-height:1.6; }
h1,h2,h3,h4,h5,h6 { font-family:'Space Grotesk',sans-serif; font-weight:700; line-height:1.2; }
a { color:inherit; text-decoration:none; }
::-webkit-scrollbar { width:6px; height:6px; }
::-webkit-scrollbar-track { background:var(--bg-primary); }
::-webkit-scrollbar-thumb { background:var(--bg-border); border-radius:3px; }
.glass { background:rgba(255,255,255,0.8); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid rgba(226,232,240,0.8); }
.accent-gradient { background:linear-gradient(135deg, var(--accent-green), var(--accent-green-light)); }
.card-hover { transition:all 0.3s ease; }
.card-hover:hover { transform:translateY(-4px); box-shadow:0 8px 30px rgba(34,197,94,0.12); border-color:var(--accent-green); }
@keyframes meshGradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
.hero-gradient { background:radial-gradient(ellipse at 20% 50%, rgba(34,197,94,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(34,197,94,0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(14,165,233,0.04) 0%, transparent 50%); background-size:200% 200%; animation:meshGradient 15s ease infinite; }
@keyframes float { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-20px) rotate(1deg)} 66%{transform:translateY(10px) rotate(-1deg)} }
.float-shape { animation:float 6s ease-in-out infinite; }
.float-shape:nth-child(2) { animation-delay:-2s; }
.float-shape:nth-child(3) { animation-delay:-4s; }
@keyframes countUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
.reveal { opacity:0; transform:translateY(30px); transition:all 0.6s ease; }
.reveal.visible { opacity:1; transform:translateY(0); }
@keyframes skeletonPulse { 0%{opacity:0.6} 50%{opacity:1} 100%{opacity:0.6} }
.skeleton { background:linear-gradient(90deg, var(--bg-card) 25%, var(--bg-border) 50%, var(--bg-card) 75%); background-size:200% 100%; animation:skeletonPulse 1.5s ease-in-out infinite; border-radius:8px; }
.back-to-top { position:fixed; bottom:30px; right:30px; width:48px; height:48px; border-radius:50%; background:var(--accent-green); color:white; display:flex; align-items:center; justify-content:center; cursor:pointer; opacity:0; visibility:hidden; transition:all 0.3s ease; z-index:100; border:none; font-size:1.2rem; }
.back-to-top.visible { opacity:1; visibility:visible; }
.back-to-top:hover { transform:translateY(-3px); box-shadow:0 4px 15px rgba(34,197,94,0.4); }
.badge-job { background:rgba(251,146,60,0.15); color:#c2410c; }
.badge-internship { background:rgba(20,184,166,0.15); color:#0d9488; }
.badge-scholarship { background:rgba(34,197,94,0.15); color:#16a34a; }
.badge-fellowship { background:rgba(245,158,11,0.15); color:#d97706; }
.badge-volunteer { background:rgba(239,68,68,0.15); color:#dc2626; }
.badge-graduate_program { background:rgba(147,51,234,0.15); color:#7c3aed; }
@keyframes toastSlideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
@keyframes toastSlideOut { from{transform:translateX(0);opacity:1} to{transform:translateX(100%);opacity:0} }
@keyframes toastProgress { from{width:100%} to{width:0%} }
.toast { animation:toastSlideIn 0.3s ease; }
.toast.removing { animation:toastSlideOut 0.3s ease forwards; }
.toast-progress { animation:toastProgress 3s linear; }
@keyframes modalFadeIn { from{opacity:0} to{opacity:1} }
@keyframes modalContentIn { from{opacity:0;transform:scale(0.95) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
.modal-backdrop { animation:modalFadeIn 0.2s ease; }
.modal-content { animation:modalContentIn 0.3s ease; }
@keyframes pageIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.page-transition { animation:pageIn 0.4s ease; }
.carousel-container { scroll-behavior:smooth; -webkit-overflow-scrolling:touch; }
.carousel-container::-webkit-scrollbar { display:none; }
@keyframes infiniteScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
.logo-scroll { animation:infiniteScroll 30s linear infinite; }
.logo-scroll:hover { animation-play-state:paused; }
@keyframes pulseBorder { 0%{border-color:rgba(239,68,68,0.3)} 50%{border-color:rgba(239,68,68,0.7)} 100%{border-color:rgba(239,68,68,0.3)} }
.pulse-border { animation:pulseBorder 2s ease-in-out infinite; }
.timeline-node { transition:all 0.3s ease; }
.timeline-node:hover,.timeline-node.active { transform:scale(1.1); box-shadow:0 0 20px rgba(34,197,94,0.2); }
.filter-scroll::-webkit-scrollbar { width:4px; }
.filter-scroll::-webkit-scrollbar-thumb { background:var(--bg-border); border-radius:2px; }
@keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
.animate-spin-slow { animation:spin-slow linear infinite; }
@keyframes float-3d { 0%,100%{transform:translateY(0) rotateX(0deg) rotateY(0deg)} 25%{transform:translateY(-30px) rotateX(5deg) rotateY(10deg)} 50%{transform:translateY(-15px) rotateX(-3deg) rotateY(-5deg)} 75%{transform:translateY(-25px) rotateX(4deg) rotateY(8deg)} }
.animate-float-3d { animation:float-3d 6s ease-in-out infinite; transform-style:preserve-3d; }
@keyframes pulse-orb { 0%,100%{transform:scale(1); opacity:0.15} 50%{transform:scale(1.3); opacity:0.25} }
@keyframes pulse-dot { 0%,100%{opacity:0.1; transform:scale(1)} 50%{opacity:0.4; transform:scale(1.5)} }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        {/* Tailwind CDN — generates all Tailwind classes at runtime (dev mode fallback) */}
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        <Script id="tailwind-config" strategy="beforeInteractive" dangerouslySetInnerHTML={{
          __html: `tailwind.config = {
  theme: {
    extend: {
      colors: {
        accent: '#22c55e',
        'accent-dark': '#16a34a',
        'accent-light': '#4ade80',
        'bg-primary': '#f0f2f5',
        'bg-surface': '#ffffff',
        'bg-card': '#ffffff',
        'bg-border': '#e2e8f0',
        'text-primary': '#1f2937',
        'text-secondary': '#6b7280',
        'text-muted': '#9ca3af',
      },
      fontFamily: {
        space: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
}` }} />
        {/* Inline fallback for custom CSS classes (glass, accent-gradient, etc.) */}
        <style dangerouslySetInnerHTML={{ __html: fallbackStyles }} />
      </head>
      <body className="min-h-full flex flex-col bg-[#f0f2f5]">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
