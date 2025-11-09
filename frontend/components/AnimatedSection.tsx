'use client';

import { useEffect } from 'react';

export function AnimatedSection({ 
  children, 
  className = '',
  animation = 'fade-up',
  delay = 0 
}: {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'slide-up';
  delay?: number;
}) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const animationClass = {
    'fade-up': 'animate-on-scroll',
    'fade-down': 'animate-on-scroll',
    'fade-left': 'animate-on-scroll-left',
    'fade-right': 'animate-on-scroll-right',
    'scale': 'animate-on-scroll-scale',
    'slide-up': 'animate-on-scroll',
  }[animation];

  return (
    <div 
      className={`${animationClass} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}