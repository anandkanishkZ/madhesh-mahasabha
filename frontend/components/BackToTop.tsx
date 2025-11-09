'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLeftSliderContext } from '@/contexts/LeftSliderContext';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isOpen: isLeftSliderOpen } = useLeftSliderContext();

  // Show button when user scrolls down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible || isLeftSliderOpen) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        fixed bottom-20 right-6 z-50 
        w-14 h-14 
        rounded-full 
        bg-mm-primary
        hover:bg-mm-secondary
        shadow-xl hover:shadow-2xl
        border-2 border-white/20
        backdrop-blur-sm
        transition-all duration-300
        hover-lift hover-glow
        ${isVisible ? 'animate-scale-in' : ''}
        ${isHovered ? 'animate-float' : ''}
        transition-all duration-300 ease-in-out
        transform hover:scale-110 active:scale-95
        focus:outline-none focus:ring-4 focus:ring-mm-primary/30
        group
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}
      `}
      aria-label="Back to top"
      title="माथि जानुहोस्"
    >
      {/* Animated background circle */}
      <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
      
      {/* Arrow icon with guaranteed white color */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <ArrowUp 
          className={`
            w-6 h-6 
            text-white 
            stroke-[2.5]
            transition-all duration-300
            ${isHovered ? 'transform -translate-y-0.5' : ''}
          `}
          style={{ color: '#ffffff', stroke: '#ffffff', fill: 'none' }}
        />
      </div>

      {/* Pulse effect */}
      <div className="absolute inset-0 rounded-full bg-mm-primary animate-ping opacity-20"></div>
      
      {/* Inner glow */}
      <div className="absolute inset-1 rounded-full bg-white/10 opacity-50"></div>
    </button>
  );
}