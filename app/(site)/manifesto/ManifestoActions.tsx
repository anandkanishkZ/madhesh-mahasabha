'use client';

import { Button } from '@/components/ui/Button';
import { Share2, Download } from 'lucide-react';

export function ManifestoActions() {
  const handleShare = async () => {
    const shareData = {
      title: 'मधेश महासभाको प्रस्तावना',
      text: 'मधेशी समुदायको एकता, समानता र अधिकारका लागि प्रस्तावना पढ्नुहोस्',
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Button variant="outline" className="w-full" onClick={handleShare}>
        <Share2 className="w-4 h-4 mr-2" />
        साझा गर्नुहोस्
      </Button>
      
      <Button variant="ghost" className="w-full" onClick={handlePrint}>
        <Download className="w-4 h-4 mr-2" />
        PDF डाउनलोड
      </Button>
    </>
  );
}