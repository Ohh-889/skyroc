import { tv } from 'tailwind-variants';

export const menuVariants = tv({
  defaultVariants: {
    size: 'md'
  },
  slots: {
    arrow: 'fill-popover stroke-transparent',
    checkboxItem: [
      `relative flex items-center rounded-sm outline-none transition-colors duration-200 cursor-pointer select-none`,
      `focus:bg-accent focus:text-accent-foreground`,
      `data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50`
    ],
    content: [
      `z-50 min-w-max rounded-md mt-1.5 border font-medium bg-popover translate-x-2 text-popover-foreground shadow-md will-change-transform`,
      `data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95`,
      `data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95`,
      `data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`
    ],
    group: '',
    item: [
      `relative flex font-medium items-center rounded-sm outline-none transition-colors duration-200 cursor-default select-none`,
      `focus:bg-accent focus:text-accent-foreground`,
      `data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50`,
      `data-[state=open]:bg-accent data-[state=open]:text-accent-foreground`
    ],
    itemIcon: `shrink-0 text-muted-foreground`,
    itemIndicator: `absolute flex items-center justify-center text-primary`,
    itemLink: [
      `relative flex items-center rounded-sm outline-none transition-colors duration-200 cursor-pointer select-none no-underline`,
      `focus:bg-accent focus:text-accent-foreground`,
      `data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50`
    ],
    itemLinkIcon: `shrink-0 self-start text-muted-foreground`,
    label: 'flex items-center font-semibold',
    radioIndicatorIcon: `shrink-0 fill-current`,
    radioItem: [
      `relative flex items-center rounded-sm outline-none transition-colors duration-200 cursor-pointer select-none`,
      `focus:bg-accent focus:text-accent-foreground`,
      `data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50`
    ],
    separator: `h-px bg-border`,
    shortcut: `ml-auto tracking-widest opacity-60`,
    subContent: [
      `z-50 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg will-change-transform`,
      `data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95`,
      `data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95`,
      `data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`
    ],
    subTrigger: `flex items-center rounded-sm outline-none cursor-default select-none focus:bg-accent data-[state=open]:bg-accent`,
    subTriggerIcon: `ml-auto text-muted-foreground`
  },
  variants: {
    size: {
      '2xl': {
        checkboxItem: 'gap-3.5 pl-12 pr-3.5 py-2.5',
        content: 'text-xl p-1.75',
        item: 'gap-3.5 px-3.5 py-2.5',
        itemIndicator: 'left-3.5',
        itemLink: 'gap-3.5 px-3.5 py-2.5',
        itemLinkIcon: 'size-4.5 -ml-3.5',
        label: 'gap-3.5 px-3.5 py-2.5',
        radioItem: 'gap-3.5 pl-12 pr-3.5 py-2.5',
        separator: '-mx-1.75 my-1.75',
        subContent: 'text-xl p-1.75',
        subTrigger: 'gap-3.5 px-3.5 py-2.5'
      },
      'lg': {
        checkboxItem: 'gap-2.5 pl-9 pr-2.5 py-1.5',
        content: 'text-base p-1.25',
        item: 'gap-2.5 px-2.5 py-1.5',
        itemIndicator: 'left-2.5',
        itemLink: 'gap-2.5 px-2.5 py-1.5',
        itemLinkIcon: 'size-3.5 -ml-2.5',
        label: 'gap-2.5 px-2.5 py-1.5',
        radioItem: 'gap-2.5 pl-9 pr-2.5 py-1.5',
        separator: '-mx-1.25 my-1.25',
        subContent: 'text-base p-1.25',
        subTrigger: 'gap-2.5 px-2.5 py-1.5'
      },
      'md': {
        checkboxItem: 'gap-2 pl-8 pr-2 py-1.5',
        content: 'text-sm p-1',
        item: 'gap-2 px-2 py-1.5',
        itemIndicator: 'left-2',
        itemLink: 'gap-2 px-2 py-1.5',
        itemLinkIcon: 'size-3 -ml-2',
        label: 'gap-2 px-2 py-1.5',
        radioItem: 'gap-2 pl-8 pr-2 py-1.5',
        separator: '-mx-1 my-1',
        subContent: 'text-sm p-1',
        subTrigger: 'gap-2 px-2 py-1.5'
      },
      'sm': {
        checkboxItem: 'gap-1.5 pl-7 pr-1.5 py-1',
        content: 'text-xs p-0.875',
        item: 'gap-1.5 px-1.5 py-1',
        itemIndicator: 'left-1.5',
        itemLink: 'gap-1.5 px-1.5 py-1',
        itemLinkIcon: 'size-2.5 -ml-1.5',
        label: 'gap-1.5 px-1.5 py-1',
        radioItem: 'gap-1.5 pl-7 pr-1.5 py-1',
        separator: '-mx-0.875 my-0.875',
        subContent: 'text-xs p-0.875',
        subTrigger: 'gap-1.5 px-1.5 py-1'
      },
      'xl': {
        checkboxItem: 'gap-3 pl-10 pr-3 py-2',
        content: 'text-lg p-1.5',
        item: 'gap-3 px-3 py-2',
        itemIndicator: 'left-3',
        itemLink: 'gap-3 px-3 py-2',
        itemLinkIcon: 'size-4 -ml-3',
        label: 'gap-3 px-3 py-2',
        radioItem: 'gap-3 pl-10 pr-3 py-2',
        separator: '-mx-1.5 my-1.5',
        subContent: 'text-lg p-1.5',
        subTrigger: 'gap-3 px-3 py-2'
      },
      'xs': {
        checkboxItem: 'gap-1 pl-6 pr-1 py-1',
        content: 'text-2xs p-0.75',
        item: 'gap-1 px-1 py-1',
        itemIndicator: 'left-1',
        itemLink: 'gap-1 px-1 py-1',
        itemLinkIcon: 'size-2 -ml-1',
        label: 'gap-1 px-1 py-1',
        radioItem: 'gap-1 pl-6 pr-1 py-1',
        separator: '-mx-0.75 my-0.75',
        subContent: 'text-2xs p-0.75',
        subTrigger: 'gap-1 px-1 py-1'
      }
    }
  }
});

export type MenuSlots = keyof typeof menuVariants.slots;
