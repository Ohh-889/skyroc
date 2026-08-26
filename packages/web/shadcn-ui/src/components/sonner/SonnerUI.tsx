'use client';

import type { CSSProperties } from 'react';
import { useTheme } from 'next-themes';
import type { ToasterProps } from 'sonner';
import { Toaster as Sonner } from 'sonner';
import { cn } from '@skyroc/utils';

const css = {
  '--border-radius': 'var(--radius - 2px)',
  '--error-text': 'hsl(var(--destructive))',
  '--info-text': 'hsl(var(--info))',
  '--normal-bg': 'hsl(var(--background))',
  '--normal-border': 'hsl(var(--border))',
  '--normal-text': 'hsl(var(--foreground))',
  '--success-text': 'hsl(var(--success))',
  '--warning-text': 'hsl(var(--warning))',
  'pointerEvents': 'auto'
};

const toastVariants
  = '!border-border !bg-card !text-card-foreground !shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),_0_2px_4px_-2px_rgb(0_0_0_/_0.1)] group  !opacity-100';

const actionButton
  = '!inline-flex !h-[26px] justify-center  px-2  gap-1 leading-5  whitespace-nowrap   focus-visible:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 !bg-primary !text-primary-foreground ';

const cancelButton
  = '!inline-flex !h-[26px] justify-center px-2  gap-1 leading-5  whitespace-nowrap   focus-visible:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 !border !border-border !bg-background !text-foreground active:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),_0_2px_4px_-2px_rgb(0_0_0_/_0.1)]';

const description = 'text-sm !text-muted-foreground';

// Add !mt-0.5 to fix icon vertical alignment with title text
const icon
  = 'group-data-[type=success]:text-success group-data-[type=info]:text-info group-data-[type=warning]:text-warning group-data-[type=error]:text-destructive';

const title = 'text-sm font-medium';

const SonnerUI = (props: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  const { expand = true, style = css as CSSProperties, toastOptions, ...rest } = props;

  return (
    <Sonner
      expand={expand}
      style={style}
      theme={theme as ToasterProps['theme']}
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...toastOptions?.classNames,
          actionButton: cn(actionButton, toastOptions?.classNames?.actionButton),
          cancelButton: cn(cancelButton, toastOptions?.classNames?.cancelButton),
          description: cn(description, toastOptions?.classNames?.description),
          icon: cn(icon, toastOptions?.classNames?.icon),
          title: cn(title, toastOptions?.classNames?.title),
          toast: cn(toastVariants, toastOptions?.classNames?.toast)
        }
      }}
      {...rest}
    />
  );
};

export default SonnerUI;
