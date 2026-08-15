import { tv } from 'tailwind-variants';

export const collapseVariants = tv({
  slots: {
    root: '',
  },
  variants: {
    border: {
      true: {
        root: 'border-b border-t border-border',
      },
    },
  },
});

/**
 * 折叠面板项样式变体。
 *
 * `measure` 槽让内容绝对定位、脱离文档流独立测量，外层高度始终由动画值驱动，
 * 因此 `wrapper` 必须裁掉溢出，否则收起状态下内容仍会露在外面。
 *
 * `arrowIcon` 槽输出的是 Uniwind 的 `accent-*` 工具类，供 `colorClassName` 取色，与 Cell 默认箭头同一套取色方式。
 */
export const collapseItemVariants = tv({
  defaultVariants: {
    size: 'md',
  },
  slots: {
    arrowIcon: 'accent-muted-foreground',
    content: 'bg-background px-4 py-3 text-sm text-muted-foreground',
    measure: 'absolute inset-x-0 top-0',
    root: '',
    wrapper: 'overflow-hidden',
  },
  variants: {
    border: {
      true: {
        root: 'border-t border-border',
      },
    },
    disabled: {
      true: {
        root: 'opacity-50',
      },
    },
    size: {
      lg: {
        content: 'px-4 py-3 text-base',
      },
      md: {
        content: 'px-4 py-3 text-sm',
      },
    },
  },
});
