'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Tabs Component — Dark fintech / warm-sunset theme
 *
 * Design Principles:
 * - Rounded-top tab buttons
 * - Soft elevation on active tab
 * - Subtle borders for definition
 * - Monospace uppercase text
 */

export interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface RetroTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const RetroTabs: React.FC<RetroTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <div className={cn('flex gap-0 border-b border-border', className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isDisabled = tab.disabled;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => !isDisabled && onTabChange(tab.id)}
            disabled={isDisabled}
            className={cn(
              'px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors',
              'border border-b-0 border-border -mb-px rounded-t-md',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              isActive && ['bg-card text-foreground font-bold border-b-card'],
              !isActive &&
                !isDisabled && [
                  'bg-secondary text-muted-foreground hover:bg-paper-tint hover:text-foreground',
                ],
              isDisabled && ['bg-paper-tint text-steel-grey cursor-not-allowed opacity-50']
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
