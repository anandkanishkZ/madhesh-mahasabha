'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LangToggle } from '@/components/LangToggle';
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
  { name: 'संसाधन', name_en: 'Resources', href: '/resources' },
  { name: 'सम्पर्क', name_en: 'Contact', href: '/contact' },
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
          'sticky top-0 z-50 w-full transition-all duration-500 border-b bg-white/95 backdrop-blur-md shadow-lg border-gray-200/50 animate-fade-in-down'
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
                className="p-2 rounded-lg text-gray-700 hover:text-mm-primary hover:bg-mm-primary/10 transition-all duration-300 focus-ring mr-4 hover-scale hover-glow"
                aria-label="द्रुत पहुँच मेनु खोल्नुहोस्"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 focus-ring rounded-md hover-scale"
              aria-label="मधेश महासभा गृहपृष्ठमा जानुहोस्"
            >
              <div className="text-xl sm:text-2xl lg:text-3xl nepali-heading font-bold text-mm-primary hover-glow transition-all duration-300">
                मधेश महासभा
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'px-4 py-2 rounded-md font-nepali-heading font-medium transition-all duration-300 focus-ring nav-item hover-lift relative overflow-hidden',
                      isActive 
                        ? 'text-mm-primary bg-mm-primary/10 active' 
                        : 'text-gray-700 hover:text-mm-primary hover:bg-mm-primary/5'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center space-x-4">
              <LangToggle />
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