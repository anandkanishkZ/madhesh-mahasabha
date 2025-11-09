'use client';

import { Button } from '@/components/ui/Button';

interface OpenLinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'accent' | 'warm' | 'link';
  className?: string;
}

export function OpenLinkButton({ href, children, variant = 'outline', className }: OpenLinkButtonProps) {
  const handleClick = () => {
    window.open(href, '_blank');
  };

  return (
    <Button variant={variant} className={className} onClick={handleClick}>
      {children}
    </Button>
  );
}