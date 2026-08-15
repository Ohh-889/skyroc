import { tv } from 'tailwind-variants';

/**
 * Notify 样式变体
 *
 * 前景色跟着 type 一起走 `-foreground` 语义 token 而不是写死 text-white：warning / success 的背景在浅色主题下并不深， 固定白字的对比度不达标，主题切换时也无从跟随。
 */
const notifyVariants = tv({
  defaultVariants: {
    type: 'danger'
  },
  slots: {
    content: 'items-center justify-center px-4 py-2',
    message: 'text-center text-sm font-medium',
    root: ''
  },
  variants: {
    type: {
      danger: { message: 'text-destructive-foreground', root: 'bg-destructive' },
      primary: { message: 'text-primary-foreground', root: 'bg-primary' },
      success: { message: 'text-success-foreground', root: 'bg-success' },
      warning: { message: 'text-warning-foreground', root: 'bg-warning' }
    }
  }
});

/**
 * Notify 宿主定位变体
 *
 * 只管贴边定位，触摸穿透一律交给 pointerEvents 属性：className 里再写一次 pointer-events-* 会和属性打架，而 RN 中 style 上的 pointerEvents
 * 优先级高于属性，最终必然有一边的语义被吃掉。
 */
const notifyPositionVariants = tv({
  base: 'absolute inset-x-0',
  defaultVariants: {
    position: 'top'
  },
  variants: {
    position: {
      bottom: 'bottom-0',
      top: 'top-0'
    }
  }
});

export { notifyPositionVariants, notifyVariants };
