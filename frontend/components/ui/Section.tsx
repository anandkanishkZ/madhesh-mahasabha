import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: 'section' | 'div' | 'main' | 'article' | 'aside';
  background?: 'default' | 'muted' | 'pattern';
}

export function Section({ 
  children, 
  className, 
  id,
  as: Component = 'section',
  background = 'default'
}: SectionProps) {
  const backgroundClasses = {
    default: '',
    muted: 'bg-gray-50',
    pattern: 'mithila-pattern bg-mm-bg',
  };

  return (
    <Component 
      id={id}
      className={cn('section', backgroundClasses[background], className)}
    >
      <div className="container-custom">
        {children}
      </div>
    </Component>
  );
}

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function SectionHeader({ children, className, centered = false }: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 lg:mb-16', centered && 'text-center', className)}>
      {children}
    </div>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function SectionTitle({ children, className, as: Component = 'h2' }: SectionTitleProps) {
  return (
    <Component className={cn('nepali-heading text-3xl lg:text-4xl font-bold text-mm-ink mb-4', className)}>
      {children}
    </Component>
  );
}

interface SectionDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionDescription({ children, className }: SectionDescriptionProps) {
  return (
    <p className={cn('nepali-text text-lg text-gray-600 max-w-3xl', className)}>
      {children}
    </p>
  );
}