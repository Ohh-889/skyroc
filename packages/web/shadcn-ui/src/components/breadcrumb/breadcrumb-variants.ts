import { tv } from 'tailwind-variants';

export const breadcrumbVariants = tv({
  defaultVariants: {
    size: 'md'
  },
  slots: {
    ellipsis: 'flex items-center justify-center',
    item: 'inline-flex items-center list-none',
    link: 'hover:text-foreground transition-colors-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary',
    list: 'flex flex-wrap items-center my-0 break-words text-muted-foreground',
    page: 'font-normal text-foreground',
    root: '',
    separator: 'text-muted-foreground flex-shrink-0 list-none'
  },
  variants: {
    size: {
      '2xl': {
        item: 'gap-3.5',
        list: 'gap-4.5',
        root: 'text-xl'
      },
      'lg': {
        item: 'gap-2.5',
        list: 'gap-3.5',
        root: 'text-base'
      },
      'md': {
        item: 'gap-2',
        list: 'gap-3',
        root: 'text-sm'
      },
      'sm': {
        item: 'gap-1.75',
        list: 'gap-2.5',
        root: 'text-xs'
      },
      'xl': {
        item: 'gap-3',
        list: 'gap-4',
        root: 'text-lg'
      },
      'xs': {
        item: 'gap-1.5',
        list: 'gap-2',
        root: 'text-2xs'
      }
    }
  }
});

export type BreadcrumbSlots = keyof typeof breadcrumbVariants.slots;
