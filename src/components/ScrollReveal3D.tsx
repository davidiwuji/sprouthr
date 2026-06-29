'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function ScrollReveal3D({ children, delay = 0, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Delay each card's animation for stagger effect
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) rotateX(0) scale(1)';
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: 0,
        transform: 'translateY(60px) rotateX(15deg) scale(0.9)',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
