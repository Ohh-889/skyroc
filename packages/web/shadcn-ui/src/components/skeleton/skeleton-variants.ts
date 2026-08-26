import { tv } from 'tailwind-variants';

export const skeletonVariants = tv({
  base: `animate-pulse rounded-md bg-accent-foreground/10`
});

export const skeletonContainerVariants = tv({
  base: 'relative',
  variants: {
    loading: {
      true: [
        'pointer-events-none select-none',
        // Hide all text colors (except excluded elements and their children)
        '[&_*:not([data-skeleton-exclude]):not([data-skeleton-exclude]_*)]:!text-transparent',
        // Hide all border colors (except excluded elements)
        '[&_*:not([data-skeleton-exclude]):not([data-skeleton-exclude]_*)]:!border-transparent',
        // Hide all background colors except skeleton items and excluded elements
        '[&_*:not([data-slot^="skeleton"]):not([data-skeleton-exclude]):not([data-skeleton-exclude]_*)]:!bg-transparent',
        // Hide all fill/stroke colors for SVG (except in excluded elements)
        '[&_svg:not([data-skeleton-exclude]_svg)]:!fill-transparent',
        '[&_svg:not([data-skeleton-exclude]_svg)]:!stroke-transparent'

      ],
      false: ''
    }
  },
  defaultVariants: {
    loading: false
  }
});

export const skeletonItemVariants = tv({
  base: 'rounded-md bg-accent-foreground/10',
  variants: {
    animation: {
      pulse: 'animate-pulse',
      wave: 'animate-skeleton-wave bg-gradient-to-r from-accent-foreground/10 via-accent-foreground/20 to-accent-foreground/10 bg-[length:200%_100%]',
      none: ''
    },
    type: {
      text: 'block h-[1.2em] min-h-4 min-w-[60px] rounded my-1',
      media: 'block min-h-[2rem] min-w-[2rem]',
      interactive: 'inline-block h-8 min-w-[80px] rounded-md'
    }
  },
  defaultVariants: {
    animation: 'pulse',
    type: 'text'
  }
});
