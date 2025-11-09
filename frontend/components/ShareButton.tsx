'use client';

import { Button } from '@/components/ui/Button';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text: string;
}

export function ShareButton({ title, text }: ShareButtonProps) {
  const handleShare = async () => {
    const shareData = {
      title,
      text,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback for browsers that don't support native sharing
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Button variant="outline" onClick={handleShare}>
      <Share2 className="w-4 h-4 mr-2" />
      साझा गर्नुहोस्
    </Button>
  );
}