'use client';

import { useState, useEffect } from 'react';
import { fetchAuthenticatedFile } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface AuthenticatedImageProps {
  filePath: string | null | undefined;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export default function AuthenticatedImage({ 
  filePath, 
  alt, 
  className = '', 
  fallbackText = 'Image not available'
}: AuthenticatedImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!filePath) {
      setLoading(false);
      setError(true);
      return;
    }

    const loadImage = async () => {
      setLoading(true);
      setError(false);
      
      try {
        const url = await fetchAuthenticatedFile(filePath);
        if (url) {
          setImageUrl(url);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error loading image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadImage();

    // Cleanup: revoke object URL when component unmounts
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [filePath]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${className}`}>
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <p className="text-gray-400 text-sm text-center px-2">{fallbackText}</p>
      </div>
    );
  }

  return (
    <>
      {!imageLoaded && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse ${className}`}>
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      )}
      <img 
        src={imageUrl} 
        alt={alt} 
        className={`${className} transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  );
}
