'use client';

import { useEffect } from 'react';

export function useScrollAnimation() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    // Observe all elements with scroll animation classes
    const animatedElements = document.querySelectorAll(
      '.animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right, .animate-on-scroll-scale'
    );

    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);
}

export function useStaggerAnimation(containerRef: React.RefObject<HTMLElement>, delay: number = 100) {
  useEffect(() => {
    if (!containerRef.current) return;

    const children = containerRef.current.children;
    Array.from(children).forEach((child, index) => {
      const element = child as HTMLElement;
      element.style.animationDelay = `${index * delay}ms`;
    });
  }, [containerRef, delay]);
}

export function usePageTransition() {
  useEffect(() => {
    // Add page enter animation
    document.body.classList.add('page-enter');
    
    const timer = setTimeout(() => {
      document.body.classList.remove('page-enter');
    }, 500);

    return () => clearTimeout(timer);
  }, []);
}