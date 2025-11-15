'use client';

import { useState, useEffect } from 'react';
import { fetchAuthenticatedFile, fetchPublicFile } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface AuthenticatedImageProps {
  filePath: string | null | undefined;
  alt: string;
  className?: string;
  fallbackText?: string;
  isPublic?: boolean;
}

export default function AuthenticatedImage({ 
  filePath, 
  alt, 
  className = '', 
  fallbackText = 'Image not available',
  isPublic = false
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
        const url = isPublic 
          ? await fetchPublicFile(filePath)
          : await fetchAuthenticatedFile(filePath);
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

  // Extract positioning and sizing classes from className
  const hasAbsolute = className.includes('absolute');
  const wrapperClasses = hasAbsolute ? className : `w-full h-full ${className}`;
  
  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${wrapperClasses}`}>
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${wrapperClasses}`}>
        <p className="text-gray-400 text-sm text-center px-2">{fallbackText}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse z-10">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      )}
      <img 
        src={imageUrl} 
        alt={alt} 
        className={`w-full h-full object-cover ${className}`}
        style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 300ms' }}
        onLoad={() => setImageLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}
