import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/**
 * Badge 样式变体。
 *
 * `badge` 槽负责数字/文本角标的底色与尺寸，`dot` 槽负责小圆点； 两者共用同一份 color，切换 `dot` 不会丢掉颜色语义。 外圈 `border-background`
 * 是与页面底色同色的描边，让角标压在头像等内容上时有一圈"挖空"效果。
 */
export const badgeVariants = tv({
  slots: {
    badge: 'items-center justify-center rounded-full border border-background',
    content: 'text-center font-bold',
    dot: 'rounded-full',
    root: 'relative'
  },
  variants: {
    color: {
      primary: { badge: 'bg-primary', content: 'text-primary-foreground', dot: 'bg-primary' },
      destructive: { badge: 'bg-destructive', content: 'text-destructive-foreground', dot: 'bg-destructive' },
      secondary: { badge: 'bg-secondary', content: 'text-secondary-foreground', dot: 'bg-secondary' },
      success: { badge: 'bg-success', content: 'text-success-foreground', dot: 'bg-success' },
      warning: { badge: 'bg-warning', content: 'text-warning-foreground', dot: 'bg-warning' },
      info: { badge: 'bg-info', content: 'text-info-foreground', dot: 'bg-info' }
    },
    // 尺寸的两条硬约束：
    // 1. 单字符要成正圆 —— min-w 必须 ≥ 字宽 + 左右 padding + 2px 描边，否则内容会把宽度撑得比 h 大；
    // 2. 文字要能上下居中 —— leading 必须 < 高度 - 2px 描边，Text 才装得进内容盒，由 justify-center 定位。
    size: {
      sm: { badge: 'h-4 min-w-4 px-0.5', content: 'text-2xs leading-3', dot: 'h-1.5 w-1.5' },
      md: { badge: 'h-5 min-w-5 px-1', content: 'text-xs leading-3.5', dot: 'h-2 w-2' },
      lg: { badge: 'h-6 min-w-6 px-1.5', content: 'text-sm leading-4', dot: 'h-2.5 w-2.5' }
    }
  },
  defaultVariants: {
    color: 'destructive',
    size: 'md'
  }
});

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
