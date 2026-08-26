import { tv } from 'tailwind-variants';
import { dialogVariants } from '../dialog/dialog-variants';

export const bottomSheetVariants = tv({
  defaultVariants: {
    size: 'md'
  },
  slots: {
    ...dialogVariants.slots,
    content: `fixed inset-x-0 bottom-0 z-50 border bg-background`,
    contentBody: `flex h-auto flex-col`,
    knob: `mx-auto shrink-0 cursor-grab active:cursor-grabbing rounded-full bg-muted`
  },
  variants: {
    size: {
      '2xl': {
        content: `mt-30 rounded-t-[16px]`,
        contentBody: `gap-y-6 max-w-3xl px-7 py-6 text-xl`,
        knob: 'mt-7 h-3.5 w-40'
      },
      'lg': {
        content: `mt-26 rounded-t-[12px]`,
        contentBody: `gap-y-4 max-w-xl px-5 py-4 text-base`,
        knob: 'mt-5 h-2.5 w-30'
      },
      'md': {
        content: `mt-24 rounded-t-[10px]`,
        contentBody: `gap-y-3 max-w-lg px-4 py-3 text-sm`,
        knob: 'mt-4 h-2 w-25'
      },
      'sm': {
        content: `mt-22 rounded-t-[8px]`,
        contentBody: `gap-y-2 max-w-md px-3 py-2 text-xs`,
        knob: 'mt-3.5 h-1.75 w-22'
      },
      'xl': {
        content: `mt-28 rounded-t-[14px]`,
        contentBody: `gap-y-5 max-w-2xl px-6 py-5 text-lg`,
        knob: 'mt-6 h-3 w-35'
      },
      'xs': {
        content: `mt-20 rounded-t-[6px]`,
        contentBody: `gap-y-1.5 max-w-md px-2 py-1.5 text-2xs`,
        knob: 'mt-3 h-1.5 w-20'
      }
    }
  }
});

export type BottomSheetSlots = keyof typeof bottomSheetVariants.slots;
