import { tv } from 'tailwind-variants';

export const hoverCardVariants = tv({
  slots: {
    arrow: 'fill-popover stroke-transparent',
    content: [
      `w-auto p-4 rounded-md border bg-popover  text-popover-foreground shadow-md outline-none z-50 will-change-transform`,
      `data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0  data-[state=open]:animate-in`,
      `data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0  data-[state=closed]:animate-out`,
      `data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`
    ]
  }
});

export type HoverCardSlots = keyof typeof hoverCardVariants.slots;
