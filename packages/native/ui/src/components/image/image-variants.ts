import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/**
 * Image 样式变体。
 *
 * `root` 是唯一的尺寸承载者：`image` 与两层占位都相对它铺满或定位，因此调用方必须把宽高给到 root（`className` / `classNames.root`）——
 * expo-image 不像 web 的 img 会按内在尺寸撑开，root 没尺寸时整个组件高度为 0。
 *
 * `indicator` 槽输出 Uniwind 的 `accent-*` 工具类，供 ActivityIndicator 与矢量图标的 `colorClassName` 取色： 这两者的颜色只认 `color`
 * prop，写 `text-*` 落到 style 上不会生效。
 */
export const imageVariants = tv({
  slots: {
    error: 'absolute inset-0 items-center justify-center bg-muted',
    image: 'h-full w-full',
    indicator: 'accent-muted-foreground',
    loading: 'absolute inset-0 items-center justify-center bg-muted',
    root: 'relative overflow-hidden'
  },
  variants: {
    radius: {
      none: {},
      sm: { root: 'rounded-sm' },
      md: { root: 'rounded-md' },
      lg: { root: 'rounded-lg' },
      xl: { root: 'rounded-xl' },
      full: { root: 'rounded-full' }
    }
  },
  defaultVariants: {
    radius: 'none'
  }
});

export type ImageVariantProps = VariantProps<typeof imageVariants>;
