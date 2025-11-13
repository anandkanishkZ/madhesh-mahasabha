'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LeftSlider } from '@/components/LeftSlider';
import { useLeftSliderContext } from '@/contexts/LeftSliderContext';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'गृह', name_en: 'Home', href: '/' },
  { name: 'परिचय', name_en: 'About', href: '/about' },
  { name: 'प्रस्तावना', name_en: 'Manifesto', href: '/manifesto' },
  { name: 'कार्यसूची', name_en: 'Agenda', href: '/agenda' },
  { name: 'सदस्यता', name_en: 'Join', href: '/join' },
  { name: 'समाचार', name_en: 'News', href: '/news' },
  { name: 'प्रेस विज्ञप्ति', name_en: 'Press Releases', href: '/press-releases' },
  { name: 'संसाधन', name_en: 'Resources', href: '/resources' },
  { name: 'सम्पर्क', name_en: 'Contact', href: '/contact' },
  { name: 'मिसन प्रतिनिधिसभा', name_en: 'Mission Representative', href: '/mission-representative', special: true },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { openSlider } = useLeftSliderContext();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header 
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-500 border-b bg-white/95 backdrop-blur-md shadow-lg border-gray-200/50'
        )}
        style={{ position: 'sticky', top: 0, zIndex: 50 }}
      >
        <nav className="container-custom" role="navigation" aria-label="मुख्य नेभिगेसन">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Slider Toggle Button - Desktop */}
            <div className="hidden lg:flex items-center">
              <button
                type="button"
                onClick={openSlider}
                className="p-2 rounded-lg text-gray-700 hover:text-mm-primary hover:bg-mm-primary/10 transition-all duration-300 focus-ring mr-4"
                aria-label="द्रुत पहुँच मेनु खोल्नुहोस्"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 focus-ring rounded-md"
              aria-label="मधेश महासभा गृहपृष्ठमा जानुहोस्"
            >
              <div className="text-xl sm:text-2xl lg:text-3xl nepali-heading font-bold text-mm-primary transition-all duration-300">
                मधेश महासभा
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                // Handle trailing slash - normalize both pathname and href
                const normalizedPathname = pathname.endsWith('/') && pathname !== '/' 
                  ? pathname.slice(0, -1) 
                  : pathname;
                const normalizedHref = item.href.endsWith('/') && item.href !== '/' 
                  ? item.href.slice(0, -1) 
                  : item.href;
                const isActive = normalizedPathname === normalizedHref;
                
                // Debug logging
                if (typeof window !== 'undefined') {
                  console.log(`[Header Debug] Item: ${item.name}, href: ${normalizedHref}, pathname: ${normalizedPathname}, isActive: ${isActive}`);
                }
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-active={isActive ? 'true' : 'false'}
                    style={{
                      color: item.special ? '#ffffff' : (isActive ? '#135D3B' : '#374151'),
                      backgroundColor: item.special 
                        ? (isActive ? '#D97706' : '#F59E0B') 
                        : (isActive ? 'rgba(19, 93, 59, 0.1)' : 'transparent'),
                      transition: 'all 0.3s ease',
                      boxShadow: item.special ? '0 4px 12px rgba(245, 158, 11, 0.3)' : 'none',
                      fontWeight: item.special ? '600' : '500'
                    }}
                    className={cn(
                      'px-4 py-2 rounded-md font-nepali-heading font-medium nav-item relative overflow-hidden',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-mm-primary focus-visible:ring-offset-2',
                      isActive ? 'active' : '',
                      item.special ? 'animate-pulse-slow' : ''
                    )}
                    onMouseEnter={(e) => {
                      if (item.special) {
                        e.currentTarget.style.backgroundColor = '#D97706';
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(217, 119, 6, 0.4)';
                      } else if (!isActive) {
                        e.currentTarget.style.color = '#135D3B';
                        e.currentTarget.style.backgroundColor = 'rgba(19, 93, 59, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (item.special) {
                        e.currentTarget.style.backgroundColor = isActive ? '#D97706' : '#F59E0B';
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                      } else if (!isActive) {
                        e.currentTarget.style.color = '#374151';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/manifesto">प्रस्तावना</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/join">सदस्यता</Link>
              </Button>
            </div>

            {/* Mobile LeftSlider button only */}
            <div className="flex items-center space-x-2 lg:hidden">
              {/* Left Slider Toggle - Mobile */}
              <button
                type="button"
                onClick={openSlider}
                className="p-2 rounded-lg text-gray-700 hover:text-mm-primary hover:bg-mm-primary/10 transition-all duration-300 focus-ring hover-scale hover-glow"
                aria-label="द्रुत पहुँच मेनु खोल्नुहोस्"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Sidebar - Removed as hamburger menu is removed */}
        </nav>
      </header>

      {/* Mobile Overlay - Removed as hamburger menu is removed */}

      {/* Left Slider Component */}
      <LeftSlider title="मधेश महासभा" />
    </>
  );
}