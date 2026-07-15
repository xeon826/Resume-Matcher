import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Button Component — Dark fintech / warm-sunset theme
 *
 * Design Principles:
 * - Soft glow shadows (dark, blurred) create depth on dark surfaces
 * - Rounded corners (rounded-md) for a modern fintech feel
 * - Subtle 1px borders (border-border) for definition
 * - Hover: background darkens; Active: slight translate for a tactile press
 * - Clear semantic variants for different actions
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant determining color and purpose:
   * - `default`: Gold (#F5C542) — Primary actions (save, submit, create)
   * - `gradient`: Sunset gradient (coral → amber) — Prominent hero CTA
   * - `destructive`: Alert Red (#E14B4B) — Destructive actions (delete, remove)
   * - `success`: Fresh Green (#3DDC97) — Positive actions (download, confirm, complete)
   * - `warning`: Pale Gold (#F7D488) — Caution actions (reset, clear, undo)
   * - `outline`: Elevated surface with border — Secondary actions (cancel, back)
   * - `secondary`: Panel surface — Tertiary actions
   * - `ghost`: No background — Subtle actions (icon buttons, navigation)
   * - `link`: Text only with underline — Inline links
   */
  variant?:
    | 'default'
    | 'gradient'
    | 'destructive'
    | 'success'
    | 'warning'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  /**
   * Button size:
   * - `default`: Standard button (h-10)
   * - `sm`: Small button (h-8)
   * - `lg`: Large button (h-12)
   * - `icon`: Square icon button (h-9 w-9)
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    // Base styles applied to ALL buttons
    const baseStyles = cn(
      // Layout & Typography
      'relative inline-flex items-center justify-center gap-2',
      'whitespace-nowrap text-sm font-medium font-mono uppercase tracking-wide',
      // Transitions — only the properties that actually change on hover/active.
      'transition-[transform,box-shadow,background-color] duration-150 ease-out',
      // Focus state — gold ring (theme --ring)
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      // Disabled state
      'disabled:pointer-events-none disabled:opacity-50',
      // SVG icon sizing
      "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
      // Rounded corners (dark theme)
      'rounded-md'
    );

    // Hit-area expansion for icon-only buttons. Many call sites override
    // size="icon" with smaller h-X w-X classes for dense toolbars (h-8 w-8,
    // h-7 w-7, etc.) — those visible sizes are under WCAG 2.5.8's 44×44 target
    // size minimum. The ::before pseudo-element extends the touch area by 6px
    // on each side without affecting visible layout, so a 32×32 button gets a
    // 44×44 touch target. For h-7 and smaller, the touch area still falls
    // short — those need an additional inline override at the call site
    // (e.g. before:-inset-[10px]).
    const iconHitArea = "before:absolute before:-inset-1.5 before:content-['']";

    // Variant styles - each has distinct purpose and color
    const variants = {
      // PRIMARY — Gold (#F5C542). Use for: Save, Submit, Create, Primary CTA.
      default: cn(
        'bg-primary text-primary-foreground',
        'border border-border',
        'shadow-sw-sm',
        'hover:bg-primary/90',
        'active:translate-y-[1px]'
      ),

      // GRADIENT — Sunset (coral → amber). Use for: prominent hero CTA.
      gradient: cn(
        'bg-gradient-sunset text-primary-foreground',
        'border border-border',
        'shadow-sw-sm',
        'hover:opacity-90',
        'active:translate-y-[1px]'
      ),

      // DESTRUCTIVE — Alert Red (#E14B4B). Use for: Delete, Remove, Dangerous actions.
      destructive: cn(
        'bg-destructive text-destructive-foreground',
        'border border-border',
        'shadow-sw-sm',
        'hover:bg-destructive/90',
        'active:translate-y-[1px]'
      ),

      // SUCCESS — Fresh Green (#3DDC97). Use for: Download, Confirm, Complete.
      success: cn(
        'bg-success text-primary-foreground',
        'border border-border',
        'shadow-sw-sm',
        'hover:bg-success/90',
        'active:translate-y-[1px]'
      ),

      // WARNING — Pale Gold (#F7D488). Use for: Reset, Clear, Undo, Caution actions.
      warning: cn(
        'bg-warning text-primary-foreground',
        'border border-border',
        'shadow-sw-sm',
        'hover:bg-warning/90',
        'active:translate-y-[1px]'
      ),

      // OUTLINE — Elevated surface with border. Use for: Cancel, Back, Secondary actions.
      outline: cn(
        'bg-background text-foreground',
        'border border-border',
        'shadow-sw-sm',
        'hover:bg-secondary',
        'active:translate-y-[1px]'
      ),

      // SECONDARY — Panel surface (#212127). Use for: Less prominent actions, Toolbar buttons.
      secondary: cn(
        'bg-secondary text-secondary-foreground',
        'border border-border',
        'shadow-sw-sm',
        'hover:bg-secondary/80',
        'active:translate-y-[1px]'
      ),

      // GHOST — No background, minimal styling. Use for: Icon buttons, Subtle navigation.
      ghost: cn(
        'bg-transparent text-foreground',
        'border-none shadow-none',
        'hover:bg-paper-tint',
        'active:bg-paper-tint'
      ),

      // LINK — Text only with underline. Use for: Inline links, Text navigation.
      link: cn(
        'bg-transparent text-primary',
        'border-none shadow-none',
        'underline-offset-4 hover:underline',
        'p-0 h-auto'
      ),
    };

    // Size styles. Icon variant is 44×44px to meet WCAG 2.2 AA target size
    // (success criterion 2.5.8). Call sites that override the visible size
    // with smaller h-X w-X classes get the touch-area expansion via the
    // iconHitArea overlay above.
    const sizes = {
      default: 'h-10 px-6 py-2',
      sm: 'h-8 px-4 py-1 text-xs',
      lg: 'h-12 px-8 py-3 text-base',
      icon: cn('h-11 w-11 p-0', iconHitArea),
    };

    const variantClass = variants[variant];
    const sizeClass = sizes[size];

    return (
      <button ref={ref} className={cn(baseStyles, variantClass, sizeClass, className)} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button };
