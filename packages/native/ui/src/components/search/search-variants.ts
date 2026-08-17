import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/**
 * Search 样式变体（外层容器 + label + action，输入框本体的样式由 Input 负责）。
 *
 * `icon` 槽输出 Uniwind 的 `accent-*` 工具类，供搜索图标的 `colorClassName` 取色， 因此图标颜色跟随主题 token，而非硬编码灰值。
 *
 * `shape` 只在 `round` 时输出圆角：`input` 槽最终合并进 Input 的 root 且排在最后， tailwind-merge 阶段会压过 Input 按 size 给出的 `rounded-md / lg /
 * xl`。 因此 `square` 什么都不写，把圆角交回 Input，各尺寸的圆角才不会被拍平成同一档。
 */
export const searchVariants = tv({
  defaultVariants: {
    shape: 'square',
    size: 'md'
  },
  slots: {
    action: 'ml-3 justify-center',
    actionText: 'text-sm text-primary',
    icon: 'accent-muted-foreground',
    input: 'flex-1',
    label: 'mr-2 text-sm text-foreground',
    root: 'flex-row items-center bg-background'
  },
  variants: {
    shape: {
      round: { input: 'rounded-full' },
      // 圆角由 Input 的 size 决定，见上方注释
      square: {}
    },
    // 外层留白跟随尺寸，否则 sm / lg 下输入框与容器的比例会失衡
    size: {
      lg: { root: 'px-4 py-2.5' },
      md: { root: 'px-3 py-2' },
      sm: { root: 'px-2 py-1.5' }
    }
  }
});

export type SearchVariantProps = VariantProps<typeof searchVariants>;

type SearchSizeKey = NonNullable<SearchVariantProps['size']>;

/** 各尺寸下搜索图标的像素大小，跟随输入框字号缩放 */
export const SEARCH_ICON_SIZE_MAP: Record<SearchSizeKey, number> = {
  lg: 18,
  md: 16,
  sm: 14
};
