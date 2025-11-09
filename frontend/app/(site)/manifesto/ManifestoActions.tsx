'use client';

import { Share2, Download } from 'lucide-react';
import { useState } from 'react';

export function ManifestoActions() {
  const [shareStatus, setShareStatus] = useState('');
  
  const handleShare = async () => {
    const shareData = {
      title: 'मधेश महासभाको प्रस्तावना',
      text: 'मधेशी समुदायको एकता, समानता र अधिकारका लागि प्रस्तावना पढ्नुहोस्',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus('साझा गरियो!');
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus('लिङ्क प्रतिलिपि गरियो!');
      }
      setTimeout(() => setShareStatus(''), 2000);
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const handleDownload = () => {
    // Trigger print dialog which can save as PDF
    window.print();
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 h-11 px-4 py-2 text-base font-nepali-heading font-semibold rounded-lg border-2 border-mm-primary text-mm-primary hover:bg-mm-primary hover:text-white transition-colors"
      >
        <Share2 className="w-5 h-5" />
        {shareStatus || 'साझा गर्नुहोस्'}
      </button>
      
      <button
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2 h-11 px-4 py-2 text-base font-nepali-heading font-semibold rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <Download className="w-5 h-5" />
        PDF डाउनलोड
      </button>
    </div>
  );
}