import { tv } from 'tailwind-variants';

export const dialogVariants = tv({
  defaultVariants: {
    size: 'md'
  },
  slots: {
    close: `absolute`,
    content: [
      `fixed left-[50%] top-[50%] z-50 flex flex-col w-full border bg-background shadow-lg translate-x-[-50%] translate-y-[-50%] md:w-full duration-200 sm:rounded-lg`,
      `data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]`,
      `data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]`
    ],
    description: `text-muted-foreground`,
    footer: `flex flex-col-reverse sm:flex-row sm:justify-end`,
    header: `flex flex-col text-center sm:text-left`,
    overlay: [
      `fixed inset-0 z-50 bg-black/80`,
      `data-[state=open]:animate-in data-[state=open]:fade-in-0`,
      `data-[state=closed]:animate-out data-[state=closed]:fade-out-0`
    ],
    title: `flex items-center font-semibold leading-none tracking-tight`
  },
  variants: {
    size: {
      '2xl': {
        close: 'right-6 top-6',
        content: `gap-y-6 max-w-3xl px-7 py-6 text-xl`,
        description: 'text-xl',
        footer: 'gap-6',
        header: 'gap-y-6',
        title: 'gap-x-3.5 text-2xl'
      },
      'lg': {
        close: 'right-4 top-4',
        content: `gap-y-4 max-w-xl px-5 py-4 text-base`,
        description: 'text-base',
        footer: 'gap-4',
        header: 'gap-y-4',
        title: 'gap-x-2.5 text-lg'
      },
      'md': {
        close: 'right-3 top-3',
        content: `gap-y-3 max-w-lg px-4 py-3 text-sm`,
        description: 'text-sm',
        footer: 'gap-3',
        header: 'gap-y-3',
        title: 'gap-x-2 text-base'
      },
      'sm': {
        close: 'right-2 top-2',
        content: `gap-y-2 max-w-md px-3 py-2 text-xs`,
        description: 'text-xs',
        footer: 'gap-2',
        header: 'gap-y-2',
        title: 'gap-x-1.75 text-sm'
      },
      'xl': {
        close: 'right-5 top-5',
        content: `gap-y-5 max-w-2xl px-6 py-5 text-lg`,
        description: 'text-lg',
        footer: 'gap-5',
        header: 'gap-y-5',
        title: 'gap-x-3 text-xl'
      },
      'xs': {
        close: 'right-1.5 top-1.5',
        content: `gap-y-1.5 max-w-md px-2 py-1.5 text-2xs`,
        description: 'text-2xs',
        footer: 'gap-1.5',
        header: 'gap-y-1.5',
        title: 'gap-x-1.5 text-xs'
      }
    }
  }
});

export type DialogSlots = keyof typeof dialogVariants.slots;
