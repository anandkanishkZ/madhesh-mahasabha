'use client';

import { usePageTransition } from '@/hooks/useAnimations';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  usePageTransition();
  usePerformanceMonitoring();

  return (
    <div className="min-h-screen w-full overflow-x-hidden page-enter">
      {children}
    </div>
  );
}