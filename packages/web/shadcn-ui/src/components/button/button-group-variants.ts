import { tv } from 'tailwind-variants';

export const buttonGroupVariants = tv({
  base: `*:relative focus-visible:*:z-2 *:not-first:not-last:rounded-none`,

  variants: {
    orientation: {
      horizontal: `inline-flex *:not-last:border-r-0 *:first:rounded-r-none *:last:rounded-l-none`,
      vertical: `flex flex-col *:not-last:border-b-0 *:first:rounded-b-none *:last:rounded-t-none`
    }
  },
  defaultVariants: {
    orientation: 'horizontal'
  }
});
