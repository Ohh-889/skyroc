import { tv } from 'tailwind-variants';

export const pickerGroupVariants = tv({
  slots: {
    activeIndicator: 'absolute bottom-0 left-0 right-0 h-0.5 bg-primary',
    root: 'bg-background',
    tab: 'flex-1 items-center justify-center py-3',
    tabBar: 'flex-row border-b border-border/40',
    tabText: 'text-sm text-muted-foreground',
    toolbar: 'flex-row items-center justify-between border-b border-border/40 py-3'
  }
});
