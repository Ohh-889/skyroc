import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/**
 * Space 样式变体。
 *
 * ⚠️ `size` 没有默认值，直接调用本函数不会得到任何 `gap-*`。默认档位 `md` 由 `Space` 组件传入—— 因为自定义数值间距要走内联 style，此处若有默认类名会与之竞争。
 */
export const spaceVariants = tv({
  compoundVariants: [
    // 换行只在水平方向有意义，纵向不做任何事
    {
      class: 'flex-wrap',
      direction: 'horizontal',
      wrap: true
    }
  ],
  // size 刻意不设默认值：自定义数值间距走内联 style，不能有 gap-* 兜底类名与之竞争
  defaultVariants: {
    direction: 'horizontal'
  },
  variants: {
    align: {
      baseline: 'items-baseline',
      center: 'items-center',
      end: 'items-end',
      start: 'items-start'
    },
    direction: {
      horizontal: 'flex-row',
      vertical: 'flex-col'
    },
    // 两个方向都是撑满宽度：纵向 Space 要的是列本身占满父级宽度，
    // 用 h-full 会让百分比高度去解析 auto 高度的父容器，布局直接塌掉
    fill: {
      true: 'w-full'
    },
    size: {
      '2xl': 'gap-8',
      lg: 'gap-4',
      md: 'gap-3',
      sm: 'gap-2',
      xl: 'gap-6',
      xs: 'gap-1'
    },
    wrap: {
      true: ''
    }
  }
});

export type SpaceVariantProps = VariantProps<typeof spaceVariants>;
