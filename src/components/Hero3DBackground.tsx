'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function Hero3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMount(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      container.style.setProperty('--mouse-x', String(x));
      container.style.setProperty('--mouse-y', String(y));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!mount) return null;

  const scrollOffset = Math.min(scrollY / 300, 1);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        perspective: '1800px',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {/* Parallax depth layers — scroll-driven */}
      <div
        className="absolute inset-0 transition-transform duration-75"
        style={{
          transform: `translateZ(${scrollOffset * -200}px) rotateX(${Math.min(scrollY * 0.02, 5)}deg)`,
        }}
      >
        {/* Layer 1 — Deep space gradient orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#22c55e]/30 to-transparent blur-[120px] animate-pulse-orb" style={{ animationDelay: '0s', willChange: 'transform' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-[#14b8a6]/25 to-transparent blur-[100px] animate-pulse-orb" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-gradient-to-bl from-[#f59e0b]/15 to-transparent blur-[80px] animate-pulse-orb" style={{ animationDelay: '4s' }} />

        {/* Layer 2 — Large rotating hexagon ring */}
        <div
          className="absolute top-[15%] left-[10%] w-96 h-96 animate-spin-slow"
          style={{
            animationDuration: '40s',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(60px)',
          }}
        >
          <div className="w-full h-full rounded-full border-4 border-[#22c55e]/30" style={{ boxShadow: '0 0 60px rgba(34,197,94,0.2), inset 0 0 60px rgba(34,197,94,0.05)' }} />
          <div className="absolute inset-[15%] rounded-full border-2 border-[#14b8a6]/20 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
          <div className="absolute inset-[30%] rounded-full border-[3px] border-dashed border-[#22c55e]/20 animate-spin-slow" style={{ animationDuration: '20s' }} />
        </div>

        {/* Layer 3 — Floating polyhedron (hexagon) */}
        <div
          className="absolute top-[55%] right-[8%] animate-float-3d"
          style={{
            animationDuration: '7s',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(100px)',
          }}
        >
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/20 to-[#14b8a6]/10 rounded-[30%] rotate-12 border border-[#22c55e]/30" style={{ boxShadow: '0 0 40px rgba(34,197,94,0.15), inset 0 0 40px rgba(34,197,94,0.05)' }} />
            <div className="absolute inset-[10%] bg-gradient-to-tr from-transparent to-[#22c55e]/10 rounded-[30%] -rotate-6 border border-[#22c55e]/20" />
            <div className="absolute inset-[20%] rounded-[30%] border border-[#4ade80]/20" />
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-[#22c55e]/60 rounded-full blur-sm" style={{ transform: 'translate(-50%, -50%)' }} />
          </div>
        </div>

        {/* Layer 4 — Second floating cube, different position */}
        <div
          className="absolute top-[25%] right-[20%] animate-float-3d"
          style={{
            animationDuration: '9s',
            animationDelay: '1s',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(80px)',
          }}
        >
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#f59e0b]/15 to-[#22c55e]/10 border border-[#f59e0b]/25 rotate-12" style={{ boxShadow: '0 0 50px rgba(245,158,11,0.1)' }} />
        </div>

        {/* Layer 5 — Floating pyramid / triangle */}
        <div
          className="absolute bottom-[20%] left-[15%] animate-float-3d"
          style={{
            animationDuration: '8s',
            animationDelay: '2s',
            transformStyle: 'preserve-3d',
            transform: 'translateZ(120px)',
          }}
        >
          <div style={{
            width: 0, height: 0,
            borderLeft: '60px solid transparent',
            borderRight: '60px solid transparent',
            borderBottom: '104px solid rgba(34,197,94,0.25)',
            filter: 'drop-shadow(0 0 30px rgba(34,197,94,0.2))',
          }} />
        </div>

        {/* Layer 6 — Particle field (grid of dots) */}
        <div className="absolute inset-0" style={{ transform: `translateZ(${scrollOffset * -100}px)` }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-[#22c55e]"
              style={{
                width: `${1 + Math.random() * 3}px`,
                height: `${1 + Math.random() * 3}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.1 + Math.random() * 0.3,
                animation: `pulse-dot ${2 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                boxShadow: `0 0 ${4 + Math.random() * 8}px rgba(34,197,94,0.3)`,
              }}
            />
          ))}
        </div>

        {/* Layer 7 — Grid floor (3D perspective grid) */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[40%]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34,197,94,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,197,94,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `rotateX(${40 - scrollOffset * 20}deg) translateY(${scrollOffset * 100}px) scale(${1 + scrollOffset * 0.3})`,
            transformOrigin: 'bottom center',
            opacity: 0.6 - scrollOffset * 0.3,
          }}
        />
      </div>
    </div>
  );
}
