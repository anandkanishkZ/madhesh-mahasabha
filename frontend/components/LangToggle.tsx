'use client';

import { useState, useEffect } from 'react';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function LangToggle() {
  const [currentLang, setCurrentLang] = useState<'ne' | 'en'>('ne');

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('mm-language') as 'ne' | 'en' || 'ne';
    setCurrentLang(savedLang);
    document.documentElement.lang = savedLang;
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLang === 'ne' ? 'en' : 'ne';
    setCurrentLang(newLang);
    localStorage.setItem('mm-language', newLang);
    document.documentElement.lang = newLang;
    
    // In a full implementation, this would trigger content translation
    // For now, we just update the UI state
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-1"
      aria-label={`भाषा परिवर्तन गर्नुहोस् - हाल ${currentLang === 'ne' ? 'नेपाली' : 'English'}`}
    >
      <Languages className="w-4 h-4" />
      <span className="text-sm font-medium">
        {currentLang === 'ne' ? 'नेपाली' : 'English'}
      </span>
    </Button>
  );
}