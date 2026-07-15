'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Toggle Switch Component — Dark fintech / warm-sunset theme
 *
 * Design Principles:
 * - Rounded container and pill-shaped toggle
 * - Clear on (gold) / off (muted) states
 * - Clear label and description
 */

export interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className,
}) => {
  const labelId = React.useId();

  const handleToggle = () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 border border-border bg-card',
        'shadow-sw-sm rounded-md',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="flex-1 mr-4">
        <div
          id={labelId}
          className="font-mono text-sm font-bold uppercase tracking-wider text-foreground"
        >
          {label}
        </div>
        {description && <div className="font-sans text-xs text-steel-grey mt-1">{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          'relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full',
          'border border-border transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:cursor-not-allowed',
          checked ? 'bg-primary' : 'bg-paper-tint'
        )}
      >
        <span
          className={cn(
            'pointer-events-none block h-4 w-4 rounded-full bg-foreground border border-border',
            'transition-transform duration-200',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );
};
