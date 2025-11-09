'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LeftSliderContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openSlider: () => void;
  closeSlider: () => void;
  toggleSlider: () => void;
}

const LeftSliderContext = createContext<LeftSliderContextType | undefined>(undefined);

export function LeftSliderProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openSlider = () => setIsOpen(true);
  const closeSlider = () => setIsOpen(false);
  const toggleSlider = () => setIsOpen(prev => !prev);

  return (
    <LeftSliderContext.Provider value={{
      isOpen,
      setIsOpen,
      openSlider,
      closeSlider,
      toggleSlider,
    }}>
      {children}
    </LeftSliderContext.Provider>
  );
}

export function useLeftSliderContext() {
  const context = useContext(LeftSliderContext);
  if (context === undefined) {
    throw new Error('useLeftSliderContext must be used within a LeftSliderProvider');
  }
  return context;
}