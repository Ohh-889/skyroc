import { tv } from 'tailwind-variants';

export const resizableVariants = tv({
  defaultVariants: {
    size: 'md'
  },
  slots: {
    handle: [
      'relative flex w-px items-center justify-center bg-border',
      'after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary',
      ' data-[panel-group-direction=vertical]:h-px  data-[panel-group-direction=vertical]:w-full',
      ' data-[panel-group-direction=vertical]:after:left-0  data-[panel-group-direction=vertical]:after:h-1  data-[panel-group-direction=vertical]:after:w-full  data-[panel-group-direction=vertical]:after:-translate-y-1  data-[panel-group-direction=vertical]:after:translate-x-0',
      '[&[data-panel-group-direction=vertical]>div]:rotate-90'
    ],
    handleIcon: '',
    handleIconRoot: 'z-2 flex items-center justify-center rounded-sm border bg-border',
    panelGroup: 'flex h-full w-full data-[panel-group-direction=vertical]:flex-col'
  },
  variants: {
    size: {
      '2xl': {
        handleIconRoot: 'w-4.5 h-6',
        panelGroup: 'text-xl'
      },
      'lg': {
        handleIconRoot: 'w-3.5 h-4.5',
        panelGroup: 'text-base'
      },
      'md': {
        handleIconRoot: 'w-3 h-4',
        panelGroup: 'text-sm'
      },
      'sm': {
        handleIconRoot: 'w-2.5 h-3.25',
        panelGroup: 'text-xs'
      },
      'xl': {
        handleIconRoot: 'w-4 h-5.25',
        panelGroup: 'text-lg'
      },
      'xs': {
        handleIconRoot: 'w-2 h-2.625',
        panelGroup: 'text-2xs'
      }
    }
  }
});

export type ResizableSlots = keyof typeof resizableVariants.slots;
