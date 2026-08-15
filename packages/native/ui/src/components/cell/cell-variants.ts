import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** Cell 的尺寸预设 */
export type CellSize = 'lg' | 'md' | 'sm';

/** 各尺寸下默认箭头的像素大小，跟随标题字号缩放，避免大号列表配小箭头 */
export const ARROW_SIZE_MAP: Record<CellSize, number> = {
  lg: 14,
  md: 12,
  sm: 11
};

/**
 * Cell 列表项样式变体。
 *
 * `arrowIcon` 槽输出的是 Uniwind 的 `accent-*` 工具类，供 `colorClassName` 取色， 因此箭头颜色跟随主题 token，而非硬编码灰值。
 */
export const cellVariants = tv({
  defaultVariants: {
    center: true,
    size: 'md'
  },
  slots: {
    arrow: 'ml-1 self-center',
    arrowIcon: 'accent-muted-foreground',
    content: 'flex-1',
    leading: 'mr-3 items-center justify-center',
    root: 'flex-row items-center bg-background',
    subtitle: 'text-muted-foreground',
    title: 'text-foreground',
    trailing: 'ml-3 justify-center',
    trailingText: 'text-muted-foreground'
  },
  variants: {
    center: {
      true: {},
      false: { root: 'items-start' }
    },
    disabled: {
      true: { root: 'opacity-50' }
    },
    size: {
      lg: {
        root: 'min-h-14 px-4 py-3.5',
        subtitle: 'mt-1 text-sm',
        title: 'text-lg',
        trailingText: 'text-base'
      },
      md: {
        root: 'min-h-12 px-4 py-3',
        subtitle: 'mt-0.5 text-xs',
        title: 'text-base',
        trailingText: 'text-sm'
      },
      sm: {
        root: 'min-h-10 px-3 py-2',
        subtitle: 'mt-0.5 text-2xs',
        title: 'text-sm',
        trailingText: 'text-xs'
      }
    }
  }
});

/**
 * CellGroup 分组容器样式变体。
 *
 * `inset` 只负责让卡片左右留边，标题保持 `px-4` 与卡片内容左对齐。
 */
export const cellGroupVariants = tv({
  defaultVariants: {
    inset: false
  },
  slots: {
    divider: 'h-px bg-border',
    root: 'overflow-hidden rounded-xl',
    title: 'px-4 pb-2 pt-4 text-sm text-muted-foreground'
  },
  variants: {
    inset: {
      true: { root: 'mx-4' }
    }
  }
});

export type CellVariantProps = VariantProps<typeof cellVariants>;
export type CellGroupVariantProps = VariantProps<typeof cellGroupVariants>;
