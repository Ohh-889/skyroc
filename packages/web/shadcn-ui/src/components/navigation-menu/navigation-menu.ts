import { tv } from 'tailwind-variants';

export const navigationMenuVariants = tv({
  slots: {
    root: `relative z-2`,
    viewportRoot: `perspective-[2000px] z-3 absolute top-full left-0 flex w-full justify-center`,
    viewport: [
      `origin-top-center relative overflow-hidden w-full rounded-md border bg-popover text-popover-foreground shadow-lg`,
      `h-[var(--radix-navigation-menu-viewport-height)] md:w-[var(--radix-navigation-menu-viewport-width)]`,
      `data-[state=open]:animate-in data-[state=open]:zoom-in-90 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95`
    ],
    content: [
      `left-0 top-0 w-full md:absolute md:w-auto`,
      `data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in`,
      `data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out`,
      `data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52`
    ],
    arrow: 'relative top-[70%] rotate-45 border border-border bg-background rounded-[2px]',
    list: `group grow flex items-center justify-center my-0 list-none`,
    subList: `grid grid-cols-[auto_auto] list-none my-0`,
    item: `list-none`,
    subItem: `list-none`,
    itemIcon: 'shrink-0',
    trigger: [
      `group inline-flex items-center rounded-md cursor-pointer bg-background font-medium transition-colors-200 decoration-none`,
      `hover:bg-accent hover:text-accent-foreground`,
      `focus:bg-accent focus:text-accent-foreground focus:outline-none`,
      `disabled:cursor-not-allowed disabled:opacity-50`,
      `data-[active]:bg-accent/50`,
      `data-[state=open]:bg-accent/50`
    ],
    subItemContent: `flex items-start rounded-md outline-none cursor-default select-none`,
    triggerIcon: `ml-auto transition duration-200 group-data-[state=open]:rotate-180`,
    indicator: [
      `absolute top-full z-2 flex mt-[1px] w-[var(--radix-navigation-menu-indicator-size)] items-end justify-center overflow-hidden transition-transform-200 ease-out translate-x-[var(--radix-navigation-menu-indicator-position)]`,
      `data-[state=visible]:animate-in data-[state=visible]:fade-in-0`,
      `data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0`
    ],
    link: [
      `group relative w-full flex items-center rounded-md font-medium outline-none cursor-pointer decoration-none`,
      `focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground`,
      `data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50`
    ],
    subLink: [
      `flex items-start select-none rounded-md no-underline outline-none transition-colors-200 cursor-pointer decoration-none`,
      `focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground`,
      `data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50`
    ],
    linkIcon: 'shrink-0 self-start',
    subLinkContent: `grow flex flex-col items-start`,
    subLinkLabel: `font-medium leading-none`,
    subLinkDescription: `line-clamp-2 text-muted-foreground leading-snug`
  },
  variants: {
    size: {
      'xs': {
        viewport: 'mt-1.75',
        list: 'gap-1 text-2xs',
        subList: 'gap-1.5 p-1.5 text-2xs',
        trigger: 'gap-1 px-1 py-1',
        indicator: 'h-1.75',
        arrow: 'size-2.25',
        link: 'gap-1 px-1 py-1',
        subItemContent: 'gap-1 px-1 py-1',
        subLink: 'gap-1 px-1 py-1',
        linkIcon: 'size-2 -ml-1',
        subLinkDescription: 'mt-1.25'
      },
      'sm': {
        viewport: 'mt-2',
        list: 'gap-1.25 text-xs',
        subList: 'gap-1.75 p-1.75 text-xs',
        trigger: 'gap-1.5 px-1.5 py-1',
        indicator: 'h-2',
        arrow: 'size-2.5',
        link: 'gap-1.5 px-1.5 py-1',
        subItemContent: 'gap-1.5 px-1.5 py-1',
        subLink: 'gap-1.5 px-1.5 py-1',
        linkIcon: 'size-2.5 -ml-1.5',
        subLinkDescription: 'mt-1.25'
      },
      'md': {
        viewport: 'mt-2.5',
        list: 'gap-1.5 text-sm',
        subList: 'gap-2 p-2 text-sm',
        trigger: 'gap-2 px-2 py-1.5',
        indicator: 'h-2.5',
        arrow: 'size-3',
        link: 'gap-2 px-2 py-1.5',
        subItemContent: 'gap-2 px-2 py-1.5',
        subLink: 'gap-2 px-2 py-1.5',
        linkIcon: 'size-3 -ml-2',
        subLinkDescription: 'mt-1.5'
      },
      'lg': {
        viewport: 'mt-3',
        list: 'gap-1.75 text-base',
        subList: 'gap-2.5 p-2.5 text-base',
        trigger: 'gap-2.5 px-2.5 py-1.5',
        indicator: 'h-3',
        arrow: 'size-3.5',
        link: 'gap-2.5 px-2.5 py-1.5',
        subItemContent: 'gap-2.5 px-2.5 py-1.5',
        subLink: 'gap-2.5 px-2.5 py-1.5',
        linkIcon: 'size-3.5 -ml-2.5',
        subLinkDescription: 'mt-1.75'
      },
      'xl': {
        viewport: 'mt-3.5',
        list: 'gap-2 text-lg',
        subList: 'gap-3 p-3 text-lg',
        trigger: 'gap-3 px-3 py-2',
        indicator: 'h-3.5',
        arrow: 'size-4',
        link: 'gap-3 px-3 py-2',
        subItemContent: 'gap-3 px-3 py-2',
        subLink: 'gap-3 px-3 py-2',
        linkIcon: 'size-4 -ml-3',
        subLinkDescription: 'mt-2'
      },
      '2xl': {
        viewport: 'mt-4',
        list: 'gap-2.5 text-xl',
        subList: 'gap-3.5 p-3.5 text-xl',
        trigger: 'gap-3.5 px-3.5 py-2.5',
        indicator: 'h-4',
        arrow: 'size-4.5',
        link: 'gap-3.5 px-3.5 py-2.5',
        subItemContent: 'gap-3.5 px-3.5 py-2.5',
        subLink: 'gap-3.5 px-3.5 py-2.5',
        linkIcon: 'size-4.5 -ml-3.5',
        subLinkDescription: 'mt-2.5'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export type NavigationMenuSlots = keyof ReturnType<typeof navigationMenuVariants>;
