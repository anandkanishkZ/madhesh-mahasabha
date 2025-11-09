import * as React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const linkButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-nepali-heading font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mm-primary focus-visible:ring-offset-2 hover-lift',
  {
    variants: {
      variant: {
        primary: 'bg-mm-primary text-white hover:bg-mm-primary/90 hover:shadow-lg hover:shadow-mm-primary/25',
        outline: 'border-2 border-mm-primary text-mm-primary hover:bg-mm-primary hover:text-white hover:shadow-lg hover:shadow-mm-primary/20',
        ghost: 'text-mm-primary hover:bg-mm-primary/10 hover:shadow-md',
        accent: 'bg-mm-accent text-white hover:bg-mm-accent/90 hover:shadow-lg hover:shadow-mm-accent/25',
        warm: 'bg-mm-warm text-mm-ink hover:bg-mm-warm/90 hover:shadow-lg hover:shadow-mm-warm/25',
        link: 'text-mm-primary underline-offset-4 hover:underline font-normal hover:scale-105',
      },
      size: {
        default: 'h-12 px-6 py-3 text-base',
        sm: 'h-10 px-4 py-2 text-sm',
        lg: 'h-14 px-8 py-4 text-lg',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkButtonVariants> {
  href: string;
}

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant, size, href, ...props }, ref) => {
    return (
      <Link
        href={href}
        className={cn(linkButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
LinkButton.displayName = 'LinkButton';

export { LinkButton, linkButtonVariants };