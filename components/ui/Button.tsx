import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-nepali-heading font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mm-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover-lift btn-ripple relative overflow-hidden',
  {
    variants: {
      variant: {
        primary: 'bg-mm-primary text-white hover:bg-mm-primary/90 active:bg-mm-primary/95 hover:shadow-lg hover:shadow-mm-primary/25',
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Add ripple effect
      const button = e.currentTarget;
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ripple.style.position = 'absolute';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.width = '0';
      ripple.style.height = '0';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(255, 255, 255, 0.6)';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.animation = 'ripple 0.6s linear';
      ripple.style.pointerEvents = 'none';
      
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
      
      // Add button press animation
      button.classList.add('btn-press');
      setTimeout(() => {
        button.classList.remove('btn-press');
      }, 150);
      
      onClick?.(e);
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
