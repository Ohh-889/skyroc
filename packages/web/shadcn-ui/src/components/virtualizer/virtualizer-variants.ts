import { tv } from 'tailwind-variants';

export const virtualizerVariants = tv({
  slots: {
    inner: '',
    root: 'scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent'
  }
});

export type VirtualizerSlots = keyof typeof virtualizerVariants.slots;
