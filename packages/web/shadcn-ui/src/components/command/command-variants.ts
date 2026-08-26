import { tv } from 'tailwind-variants';

export const commandVariants = tv({
  defaultVariants: {
    size: 'md'
  },
  slots: {
    dialog: `p-0 gap-0`,
    empty: `text-center`,
    group: `overflow-hidden text-foreground`,
    groupLabel: `font-medium text-muted-foreground`,
    input: `flex w-full rounded-md bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50`,
    inputIcon: `shrink-0 opacity-50`,
    inputWrapper: 'flex items-center border-b',
    item: [
      `relative flex cursor-default font-medium select-none items-center rounded-sm outline-none`,
      `data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50`
    ],
    itemIcon: 'shrink-0 text-muted-foreground',
    list: `overflow-y-auto overflow-x-hidden`,
    root: `flex w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground`,
    separator: `h-px bg-border`,
    shortcut: `ml-auto`
  },
  variants: {
    size: {
      '2xl': {
        empty: 'py-6',
        groupLabel: 'p-3',
        input: 'h-12',
        inputIcon: 'mr-3.5',
        inputWrapper: 'px-4.5 py-1.25',
        item: 'gap-3.5 px-3.5 py-2.5',
        list: 'max-h-115 py-1.75',
        root: 'text-xl',
        separator: '-mx-3.5 my-2'
      },
      'lg': {
        empty: 'py-4.5',
        groupLabel: 'p-2',
        input: 'h-9',
        inputIcon: 'mr-2.5',
        inputWrapper: 'px-3.5 py-0.875',
        item: 'gap-2.5 px-2.5 py-1.5',
        list: 'max-h-90 py-1.25',
        root: 'text-base',
        separator: '-mx-2.5 my-1.25'
      },
      'md': {
        empty: 'py-4 text-sm',
        groupLabel: 'p-1.75',
        input: 'h-8',
        inputIcon: 'mr-2',
        inputWrapper: 'px-2.5 py-0.75',
        item: 'gap-2 px-2 py-1.5',
        list: 'max-h-80 py-1',
        root: 'text-sm',
        separator: '-mx-2 my-1'
      },
      'sm': {
        empty: 'py-3.5',
        groupLabel: 'p-1.25',
        input: 'h-7',
        inputIcon: 'mr-1.75',
        inputWrapper: 'px-2 py-0.625',
        item: 'gap-1.5 px-1.5 py-1',
        list: 'max-h-75 py-0.875',
        root: 'text-xs',
        separator: '-mx-1.5 my-1'
      },
      'xl': {
        empty: 'py-5',
        groupLabel: 'p-2.5',
        input: 'h-10',
        inputIcon: 'mr-3',
        inputWrapper: 'px-4 py-1',
        item: 'gap-3 px-3 py-2',
        list: 'max-h-100 py-1.5',
        root: 'text-lg',
        separator: '-mx-3 my-1.5'
      },
      'xs': {
        empty: 'py-3',
        groupLabel: 'p-0.75',
        input: 'h-6',
        inputIcon: 'mr-1.5',
        inputWrapper: 'px-1.5 py-0.5',
        item: 'gap-1 px-1 py-1',
        list: 'max-h-70 py-0.75',
        root: 'text-2xs',
        separator: '-mx-1 my-0.75'
      }
    }
  }
});

export type CommandSlots = keyof typeof commandVariants.slots;
