import { tv } from 'tailwind-variants';

export const tabsVariants = tv({
  slots: {
    content: 'flex-1',
    indicator: 'rounded-full w-full',
    pager: 'flex-1',
    root: 'flex-1 bg-background',
    tab: 'items-center justify-center px-4 py-3',
    tabBar: 'relative',
    tabBarContent: 'flex-row',
    tabText: 'text-sm text-muted-foreground'
  },
  variants: {
    type: {
      line: {
        indicator: 'h-0.5 bg-primary',
        tabBar: 'border-b border-border/40'
      },
      pill: {
        indicator: 'h-full rounded-lg bg-background shadow-sm',
        tabBar: 'mx-4 my-2 rounded-xl bg-muted p-1',
        tabBarContent: 'w-full',
        tab: 'flex-1'
      }
    },
    active: {
      true: {
        tabText: 'font-semibold text-primary'
      }
    },
    disabled: {
      true: {
        tab: 'opacity-40'
      }
    }
  },
  defaultVariants: {
    type: 'line'
  }
});
