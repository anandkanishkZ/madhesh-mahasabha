'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Home, Info, FileText, Calendar, UserPlus, Newspaper, Megaphone, BookOpen, Mail, Target } from 'lucide-react';
import { useLeftSliderContext } from '@/contexts/LeftSliderContext';
import { cn } from '@/lib/utils';

interface LeftSliderProps {
  title?: string;
  children?: React.ReactNode;
}

const navigation = [
  { name: 'गृह', name_en: 'Home', href: '/', icon: Home },
  { name: 'परिचय', name_en: 'About', href: '/about', icon: Info },
  { name: 'प्रस्तावना', name_en: 'Manifesto', href: '/manifesto', icon: FileText },
  { name: 'कार्यसूची', name_en: 'Agenda', href: '/agenda', icon: Calendar },
  { name: 'सदस्यता', name_en: 'Join', href: '/join', icon: UserPlus },
  { name: 'समाचार', name_en: 'News', href: '/news', icon: Newspaper },
  { name: 'प्रेस विज्ञप्ति', name_en: 'Press Releases', href: '/press-releases', icon: Megaphone },
  { name: 'संसाधन', name_en: 'Resources', href: '/resources', icon: BookOpen },
  { name: 'सम्पर्क', name_en: 'Contact', href: '/contact', icon: Mail },
  { name: 'मिसन प्रतिनिधिसभा', name_en: 'Mission Representative', href: '/mission-representative', icon: Target, special: true },
];

export function LeftSlider({ title, children }: LeftSliderProps) {
  const pathname = usePathname();
  const { isOpen, closeSlider } = useLeftSliderContext();
  const drawerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchCurrentX = useRef<number>(0);
  const isHorizontalSwipe = useRef<boolean>(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const activeLinkRef = useRef<HTMLAnchorElement>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Focus management - focus active link or first link
      setTimeout(() => {
        if (activeLinkRef.current) {
          activeLinkRef.current.focus();
        } else if (firstLinkRef.current) {
          firstLinkRef.current.focus();
        }
      }, 50);
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // Handle Escape key and outside click
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeSlider();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        closeSlider();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeSlider]);

  // Touch gesture handlers for swipe to close (only horizontal swipes)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchCurrentX.current = e.touches[0].clientX;
    isHorizontalSwipe.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX;
    const diffX = touchCurrentX.current - touchStartX.current;
    const diffY = e.touches[0].clientY - touchStartY.current;
    
    // Determine if this is a horizontal or vertical swipe
    if (!isHorizontalSwipe.current && Math.abs(diffX) > 10) {
      isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
    }
    
    // Only apply transform for horizontal swipes to the left
    if (isHorizontalSwipe.current && diffX < 0 && drawerRef.current) {
      e.preventDefault(); // Prevent scrolling only for horizontal swipes
      drawerRef.current.style.transform = `translateX(${Math.max(diffX, -350)}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!isHorizontalSwipe.current) return;
    
    const diff = touchCurrentX.current - touchStartX.current;
    
    if (drawerRef.current) {
      drawerRef.current.style.transform = '';
      
      if (diff < -100) {
        closeSlider();
      }
    }
  };

  // Normalize pathname for comparison
  const normalizedPathname = pathname.endsWith('/') && pathname !== '/' 
    ? pathname.slice(0, -1) 
    : pathname;

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-gradient-to-br from-black/70 via-black/50 to-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSlider}
        aria-hidden={!isOpen}
      />

      {/* Slide-in Drawer */}
      <aside
        ref={drawerRef}
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[85%] max-w-[350px]",
          "bg-gradient-to-b from-slate-900/95 via-gray-900/95 to-black/95",
          "backdrop-blur-xl border-r border-white/10 shadow-2xl",
          "transform transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
          "overflow-hidden flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between h-[70px] px-5 border-b border-white/10 text-white bg-gradient-to-r from-slate-800/50 to-gray-800/50 flex-shrink-0">
          <Link 
            href="/" 
            onClick={(e) => {
              if (typeof window !== 'undefined' && window.location.pathname === '/') {
                e.preventDefault();
                window.location.reload();
              }
              closeSlider();
            }}
            className="flex-1"
          >
            <h2 className="text-xl font-nepali-sidebar font-bold text-white leading-tight drop-shadow-lg">
              {title || "मधेश महासभा"}
            </h2>
          </Link>
          <button
            onClick={closeSlider}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav 
          className="flex-1 overflow-y-auto py-6 overscroll-contain drawer-nav" 
          aria-label="Mobile navigation"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
          }}
        >
          <ul className="space-y-2 px-4">
            {navigation.map((item, index) => {
              const normalizedHref = item.href.endsWith('/') && item.href !== '/' 
                ? item.href.slice(0, -1) 
                : item.href;
              const isActive = normalizedPathname === normalizedHref;
              const Icon = item.icon;

              return (
                <li 
                  key={item.href} 
                  className={cn(
                    "drawer-link",
                    isOpen ? "opacity-0" : "opacity-0"
                  )}
                  style={isOpen ? {
                    animationName: 'slideInLeft',
                    animationDuration: '0.3s',
                    animationTimingFunction: 'ease-out',
                    animationFillMode: 'forwards',
                    animationDelay: `${index * 50}ms`
                  } : {
                    animationName: 'none'
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={closeSlider}
                    ref={(() => {
                      if (index === 0) return firstLinkRef;
                      if (isActive) return activeLinkRef;
                      return null;
                    })()}
                    className={cn(
                      "group relative flex items-center gap-3 px-4 py-3 rounded-xl",
                      "text-white uppercase tracking-wide text-sm font-medium font-nepali-sidebar",
                      "transition-all duration-300",
                      "hover:bg-white/10 hover:backdrop-blur-md",
                      "focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30",
                      item.special
                        ? (isActive
                            ? "bg-gradient-to-r from-amber-600/30 to-amber-500/20 shadow-lg shadow-amber-500/20"
                            : "bg-gradient-to-r from-amber-500/20 to-amber-400/10 hover:from-amber-600/30 hover:to-amber-500/20")
                        : (isActive
                            ? "bg-gradient-to-r from-mm-primary/20 to-mm-primary/10 shadow-lg shadow-mm-primary/20"
                            : "")
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {/* Icon */}
                    <Icon className={cn(
                      "w-5 h-5 flex-shrink-0 transition-transform duration-200",
                      item.special ? "text-amber-300" : "text-white/90",
                      "group-hover:scale-110"
                    )} />

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate text-white">
                        {item.name}
                      </div>
                      <div className="text-xs opacity-70 truncate text-gray-300">
                        {item.name_en}
                      </div>
                    </div>

                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-mm-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />

                    {/* Active indicator */}
                    {isActive && (
                      <div className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full shadow-sm",
                        item.special ? "bg-amber-400" : "bg-mm-primary"
                      )} />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Drawer Footer */}
        <div className="px-5 py-4 border-t border-white/10 bg-gradient-to-r from-slate-800/30 to-gray-800/30 flex-shrink-0">
          <div className="flex flex-col gap-3">
            <Link 
              href="/join" 
              onClick={closeSlider}
              className="w-full px-4 py-2.5 bg-mm-primary/20 border border-mm-primary/40 rounded-lg text-white hover:bg-mm-primary/30 transition-colors duration-200 text-sm font-medium text-center flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              सदस्यता लिनुहोस्
            </Link>
            <Link 
              href="/contact" 
              onClick={closeSlider}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors duration-200 text-sm font-medium text-center flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              सम्पर्क गर्नुहोस्
            </Link>
          </div>
        </div>
      </aside>

      {/* Animations */}
      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Custom scrollbar for drawer */
        .drawer-nav::-webkit-scrollbar {
          width: 4px;
        }

        .drawer-nav::-webkit-scrollbar-track {
          background: transparent;
        }

        .drawer-nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }

        .drawer-nav::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
}
