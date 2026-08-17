import { tv } from 'tailwind-variants';

/**
 * Notify 样式变体
 *
 * 前景色跟着 type 一起走 `-foreground` 语义 token 而不是写死 text-white：warning / success 的背景在浅色主题下并不深， 固定白字的对比度不达标，主题切换时也无从跟随。
 */
const notifyVariants = tv({
  defaultVariants: {
    position: 'top',
    safeAreaInset: false,
    type: 'danger'
  },
  slots: {
    content: 'items-center justify-center px-4 py-2',
    message: 'text-center text-sm font-medium',
    root: ''
  },
  variants: {
    /** 贴边方向本身不带样式，只用来决定安全区补偿画在哪一侧 */
    position: {
      bottom: {},
      top: {}
    },
    safeAreaInset: {
      false: {},
      true: {}
    },
    type: {
      danger: { message: 'text-destructive-foreground', root: 'bg-destructive' },
      primary: { message: 'text-primary-foreground', root: 'bg-primary' },
      success: { message: 'text-success-foreground', root: 'bg-success' },
      warning: { message: 'text-warning-foreground', root: 'bg-warning' }
    }
  },
  /**
   * 安全区补偿走 uniwind 的 pt-safe / pb-safe，尺寸由应用根节点的 Uniwind.updateInsets 同步进运行时。
   *
   * 补偿必须落在带背景色的 root 上，色块才能一直铺到状态栏 / home indicator。
   */
  compoundVariants: [
    { position: 'top', safeAreaInset: true, class: { root: 'pt-safe' } },
    { position: 'bottom', safeAreaInset: true, class: { root: 'pb-safe' } }
  ]
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
