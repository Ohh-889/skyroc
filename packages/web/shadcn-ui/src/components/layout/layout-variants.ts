// @unocss-include
import { tv } from 'tailwind-variants';
import type { VariantProps } from 'tailwind-variants';

export const layoutVariants = tv({
  slots: {
    root: 'group relative flex w-full min-h-full data-[side=right]:flex-row-reverse',
    sidebarRoot: 'hidden md:block',
    sidebarWrapper: `absolute inset-y-0 z-10 hidden h-full w-[var(--skyroc-sidebar-width)] transition-[left,right,width,opacity] duration-200 ease-linear md:flex`,
    sidebar: [
      `flex flex-col size-full bg-sidebar-background`,
      `group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-border group-data-[variant=floating]:border-solid group-data-[variant=floating]:shadow`
    ],
    sidebarGapHandler: [
      `relative h-full w-[var(--skyroc-sidebar-width)] bg-transparent transition-width duration-200 ease-linear`,
      `group-data-[collapsible=offcanvas]:w-0`,
      `group-data-[side=right]:rotate-180`
    ],
    mobileRoot: 'w-[var(--skyroc-sidebar-width)] bg-sidebar-background p-0 [&>button]:hidden',
    mobileOverlay: [
      `fixed inset-0 z-50 bg-black/80`,
      `data-[state=open]:animate-in data-[state=open]:fade-in-0`,
      `data-[state=closed]:animate-out data-[state=closed]:fade-out-0`
    ],
    mobile: 'flex flex-col size-full',
    rail: [
      'absolute inset-y-0 z-20 hidden w-[var(--skyroc-layout-spacing)] -translate-x-1/2 transition-all ease-linear sm:flex',
      `after:absolute after:inset-y-0 after:left-1/2 after:content-[''] after:w-[calc(var(--skyroc-layout-spacing)/8)] hover:after:bg-sidebar-border`
    ],
    trigger: '',
    main: 'relative flex flex-1 flex-col items-stretch min-h-full bg-background',
    header: 'relative flex items-center shrink-0',
    tab: 'shrink-0',
    footer: 'shrink-0'
  },
  variants: {
    size: {
      'xs': {
        root: 'text-2xs [--skyroc-layout-spacing:0.75rem]'
      },
      'sm': {
        root: 'text-xs [--skyroc-layout-spacing:0.875rem]'
      },
      'md': {
        root: 'text-sm [--skyroc-layout-spacing:1rem]'
      },
      'lg': {
        root: 'text-base [--skyroc-layout-spacing:1.25rem]'
      },
      'xl': {
        root: 'text-lg [--skyroc-layout-spacing:1.5rem]'
      },
      '2xl': {
        root: 'text-xl [--skyroc-layout-spacing:1.75rem]'
      }
    },
    variant: {
      sidebar: {
        sidebarGapHandler: 'group-data-[collapsible=icon]:w-[var(--skyroc-collapsed-sidebar-width)]',
        sidebarWrapper: `group-data-[collapsible=icon]:w-[var(--skyroc-collapsed-sidebar-width)] group-data-[side=left]:border-r group-data-[side=right]:border-l`
      },
      floating: {
        sidebarGapHandler: `w-[calc(var(--skyroc-sidebar-width)+var(--skyroc-layout-spacing))] group-data-[collapsible=icon]:w-[calc(var(--skyroc-collapsed-sidebar-width)+var(--skyroc-layout-spacing))]`,
        sidebarWrapper: `p-[calc(var(--skyroc-layout-spacing)/2)] w-[calc(var(--skyroc-sidebar-width)+var(--skyroc-layout-spacing))] group-data-[collapsible=icon]:w-[calc(var(--skyroc-collapsed-sidebar-width)+var(--skyroc-layout-spacing))]`
      },
      inset: {
        root: 'bg-sidebar-background',
        sidebarGapHandler: `w-[calc(var(--skyroc-sidebar-width)+var(--skyroc-layout-spacing))] group-data-[collapsible=icon]:w-[calc(var(--skyroc-collapsed-sidebar-width)+var(--skyroc-layout-spacing))]`,
        sidebarWrapper: `p-[calc(var(--skyroc-layout-spacing)/2)] w-[calc(var(--skyroc-sidebar-width)+var(--skyroc-layout-spacing))] group-data-[collapsible=icon]:w-[calc(var(--skyroc-collapsed-sidebar-width)+var(--skyroc-layout-spacing))]`,
        main: `md:m-[calc(var(--skyroc-layout-spacing)/2)] md:ml-0 md:rounded-xl md:shadow`
      }
    },
    side: {
      left: {
        sidebarWrapper: 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--skyroc-sidebar-width)*-1)]',
        rail: 'cursor-w-resize group-data-[state=collapsed]:cursor-e-resize -right-[var(--skyroc-layout-spacing)]'
      },
      right: {
        sidebarWrapper: 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--skyroc-sidebar-width)*-1)]',
        rail: 'cursor-e-resize group-data-[state=collapsed]:cursor-w-resize left-0'
      }
    },
    collapsible: {
      offcanvas: {
        sidebarWrapper: 'group-data-[state=collapsed]:opacity-0',
        rail: `translate-x-0 after:left-full hover:bg-sidebar-background`
      },
      icon: {}
    }
  },
  compoundVariants: [
    {
      side: 'left',
      collapsible: 'offcanvas',
      class: {
        rail: '-right-[calc(var(--skyroc-layout-spacing)/2)]'
      }
    },
    {
      side: 'right',
      collapsible: 'offcanvas',
      class: {
        rail: '-left-[calc(var(--skyroc-layout-spacing)/2)]'
      }
    },
    {
      side: 'left',
      variant: 'inset',
      collapsible: 'offcanvas',
      class: {
        rail: 'group-data-[state=collapsed]:right-0'
      }
    },
    {
      side: 'right',
      variant: 'inset',
      collapsible: 'offcanvas',
      class: {
        rail: 'group-data-[state=collapsed]:left-0'
      }
    },
    {
      side: 'left',
      variant: 'floating',
      collapsible: 'offcanvas',
      class: {
        rail: 'group-data-[state=collapsed]:right-[calc(var(--skyroc-layout-spacing)/2)]'
      }
    },
    {
      side: 'right',
      variant: 'floating',
      collapsible: 'offcanvas',
      class: {
        rail: 'group-data-[state=collapsed]:left-[calc(var(--skyroc-layout-spacing)/2)]'
      }
    },
    {
      variant: 'inset',
      collapsible: 'offcanvas',
      class: {
        main: 'md:group-data-[state=collapsed]:ml-[calc(var(--skyroc-layout-spacing)/2)]'
      }
    }
  ],
  defaultVariants: {
    variant: 'sidebar',
    side: 'left',
    collapsible: 'icon',
    size: 'md'
  }
});

type LayoutVariants = VariantProps<typeof layoutVariants>;

export type LayoutVariant = NonNullable<LayoutVariants['variant']>;
export type LayoutCollapsible = NonNullable<LayoutVariants['collapsible']>;
export type LayoutSide = NonNullable<LayoutVariants['side']>;

export type LayoutSlots = keyof typeof layoutVariants.slots;
