'use client';

import { useEffect } from 'react';

export function usePerformanceMonitoring() {
  useEffect(() => {
    // Monitor animation performance
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'measure' && entry.name.includes('animation')) {
          console.log(`Animation ${entry.name} took ${entry.duration}ms`);
          
          // Warn if animation is taking too long
          if (entry.duration > 16.67) { // More than one frame at 60fps
            console.warn(`Slow animation detected: ${entry.name} took ${entry.duration}ms`);
          }
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      console.log('User prefers reduced motion - animations are disabled');
    }

    // Monitor frame rate
    let lastTime = performance.now();
    let frameCount = 0;
    
    function measureFPS() {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        if (fps < 55) {
          console.warn(`Low FPS detected: ${fps} fps`);
        }
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    }
    
    requestAnimationFrame(measureFPS);

    return () => {
      observer.disconnect();
    };
  }, []);
}

export function markAnimationStart(name: string) {
  performance.mark(`${name}-start`);
}

export function markAnimationEnd(name: string) {
  performance.mark(`${name}-end`);
  performance.measure(`animation-${name}`, `${name}-start`, `${name}-end`);
}