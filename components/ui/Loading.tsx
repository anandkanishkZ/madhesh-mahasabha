import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('loading-spinner border-2 border-gray-300 border-t-mm-primary rounded-full', sizeClasses[size], className)} />
  );
}

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn('loading-wave flex space-x-1', className)}>
      <span className="w-2 h-2 bg-mm-primary rounded-full"></span>
      <span className="w-2 h-2 bg-mm-primary rounded-full"></span>
      <span className="w-2 h-2 bg-mm-primary rounded-full"></span>
    </div>
  );
}

interface LoadingTextProps {
  text?: string;
  className?: string;
}

export function LoadingText({ text = 'लोड गर्दै...', className }: LoadingTextProps) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <LoadingSpinner size="sm" />
      <span className="nepali-text text-gray-600">{text}</span>
    </div>
  );
}