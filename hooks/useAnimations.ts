'use client';

import { useEffect } from 'react';

export function useScrollAnimation() {
  useEffect(() => {
    // Small delay to ensure DOM is fully ready
    const initTimeout = setTimeout(() => {
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

      // Immediately show elements that are already in viewport
      animatedElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInViewport) {
          // Add class immediately for elements in viewport on load
          el.classList.add('is-visible');
        }
        
        observer.observe(el);
      });

      // Cleanup function
      return () => {
        animatedElements.forEach((el) => observer.unobserve(el));
        observer.disconnect();
      };
    }, 50); // Small delay to ensure DOM is ready

    return () => {
      clearTimeout(initTimeout);
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