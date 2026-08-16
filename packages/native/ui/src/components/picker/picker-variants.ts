import { tv } from 'tailwind-variants';

/** Default height of each picker item in pixels */
export const DEFAULT_ITEM_HEIGHT = 48;

/** Default number of visible items in the picker */
export const DEFAULT_VISIBLE_COUNT = 5;

export const pickerVariants = tv({
  slots: {
    cancel: '',
    cancelText: '',
    confirm: '',
    confirmText: '',
    item: 'items-center justify-center',
    itemText: 'text-base text-foreground w-full  text-center',
    loading: 'absolute inset-0 items-center justify-center bg-background/60',
    root: 'bg-background rounded-2xl overflow-hidden',
    selectedIndicator: 'border-y border-border/40 h-full w-full',
    title: 'flex-1 text-center text-base font-semibold text-foreground',
    toolbar: 'flex-row items-center justify-between border-b border-border/40 py-3'
  }
});
