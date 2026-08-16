import { tv } from 'tailwind-variants';

const swipeCellVariants = tv({
  slots: {
    content: 'w-full bg-card',
    leading: 'absolute bottom-0 left-0 top-0 flex-row',
    root: 'overflow-hidden',
    trailing: 'absolute bottom-0 right-0 top-0 flex-row'
  }
});

export { swipeCellVariants };
