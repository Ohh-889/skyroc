import { tv } from 'tailwind-variants';

/** Toast 样式变体 */
export const toastVariants = tv({
  defaultVariants: {
    hasIcon: false
  },
  slots: {
    icon: 'items-center justify-center',
    message: 'text-center text-sm leading-5 text-carbon-foreground',
    root: 'items-center justify-center rounded-xl bg-carbon/90'
  },
  variants: {
    hasIcon: {
      true: {
        icon: 'mb-2',
        root: 'min-w-28 max-w-40 p-4'
      },
      false: {
        root: 'max-w-[85%] min-w-24 px-4 py-3'
      }
    }
  }
});

/**
 * Toast 宿主定位变体
 *
 * 这里只管定位与排布，触摸穿透一律交给 pointerEvents 属性：className 里再写一次 pointer-events-* 会和属性打架，而 RN 中 style 上的 pointerEvents
 * 优先级高于属性，最终必然有一边的语义被吃掉。
 */
export const toastPositionVariants = tv({
  base: 'absolute inset-x-0 items-center gap-3',
  defaultVariants: {
    position: 'middle'
  },
  variants: {
    position: {
      bottom: 'bottom-[20%]',
      middle: 'bottom-0 top-0 justify-center',
      top: 'top-[20%]'
    }
  }
});
