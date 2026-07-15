import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Input Component — Dark fintech / warm-sunset theme
 *
 * Design Principles:
 * - Rounded corners (rounded-md) for a modern feel
 * - Subtle border (border-border) for definition on dark surfaces
 * - Gold focus ring (theme --ring)
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full border border-border bg-transparent px-3 py-2 text-sm text-foreground',
          'placeholder:text-steel-grey',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'rounded-md',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
