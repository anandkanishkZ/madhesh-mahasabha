'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LangToggle } from '@/components/LangToggle';
import { useLeftSliderContext } from '@/contexts/LeftSliderContext';
import { cn } from '@/lib/utils';

interface LeftSliderProps {
  title?: string;
  children?: React.ReactNode;
}

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

export function LeftSlider({ title, children }: LeftSliderProps) {
  const pathname = usePathname();
  const { isOpen, closeSlider } = useLeftSliderContext();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSlider}
      />
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-nepali-sidebar font-bold text-mm-primary">
            {title || "मधश महसभ"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeSlider}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <nav className="p-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSlider}
                className={cn(
                  "block px-4 py-3 rounded-lg font-nepali-sidebar text-lg font-medium transition-colors duration-200",
                  pathname === item.href
                    ? "bg-mm-primary text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-mm-primary"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="px-6 py-4 border-t border-gray-200">
            <LangToggle />
          </div>
          {children && (
            <div className="px-6 py-4 border-t border-gray-200">
              {children}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
