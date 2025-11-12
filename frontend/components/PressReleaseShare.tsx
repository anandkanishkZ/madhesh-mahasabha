'use client';

import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';

interface PressReleaseShareProps {
  title: string;
  excerpt: string;
  url?: string;
}

export function PressReleaseShare({ title, excerpt, url }: PressReleaseShareProps) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('लिङ्क प्रतिलिपि गरियो!');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('लिङ्क प्रतिलिपि गरियो!');
  };

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const handleLinkedInShare = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  return (
    <>
      {/* Header Share Buttons */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-500 nepali-text">साझा गर्नुहोस्:</span>
        <div className="flex items-center gap-1 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <button
            onClick={handleShare}
            className="w-8 h-8 flex items-center justify-center bg-gray-600 hover:bg-gray-700 rounded transition-colors"
            title="साझा गर्नुहोस्"
          >
            <Share2 className="w-4 h-4 text-white" />
          </button>
          
          <button
            onClick={handleTwitterShare}
            className="w-8 h-8 flex items-center justify-center bg-black hover:bg-gray-800 rounded transition-colors"
            title="Twitter मा साझा गर्नुहोस्"
          >
            <Twitter className="w-4 h-4 text-white" />
          </button>

          <button
            onClick={handleFacebookShare}
            className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            title="Facebook मा साझा गर्नुहोस्"
          >
            <Facebook className="w-4 h-4 text-white" />
          </button>

          <button
            onClick={handleLinkedInShare}
            className="w-8 h-8 flex items-center justify-center bg-blue-700 hover:bg-blue-800 rounded transition-colors"
            title="LinkedIn मा साझा गर्नुहोस्"
          >
            <Linkedin className="w-4 h-4 text-white" />
          </button>

          <button
            onClick={handleCopyLink}
            className="w-8 h-8 flex items-center justify-center bg-green-600 hover:bg-green-700 rounded transition-colors"
            title="लिङ्क प्रतिलिपि गर्नुहोस्"
          >
            <LinkIcon className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </>
  );
}

export function PressReleaseShareSection({ title, excerpt }: PressReleaseShareProps) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('लिङ्क प्रतिलिपि गरियो!');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('लिङ्क प्रतिलिपि गरियो!');
  };

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const handleLinkedInShare = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 nepali-text" style={{ fontFamily: "'Ek Mukta', 'Mukta', sans-serif" }}>
        यो लेख साझा गर्नुहोस्
      </h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2 bg-mm-primary text-white rounded-lg hover:bg-mm-primary/90 transition-colors text-sm font-medium shadow-sm nepali-text"
        >
          <Share2 className="w-4 h-4" />
          साझा गर्नुहोस्
        </button>
        
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium nepali-text"
        >
          <LinkIcon className="w-4 h-4" />
          लिङ्क प्रतिलिपि गर्नुहोस्
        </button>

        <button
          onClick={handleTwitterShare}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors text-sm font-medium"
        >
          <Twitter className="w-4 h-4" />
          Twitter
        </button>

        <button
          onClick={handleFacebookShare}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
        >
          <Facebook className="w-4 h-4" />
          Facebook
        </button>

        <button
          onClick={handleLinkedInShare}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </button>
      </div>
    </div>
  );
}
