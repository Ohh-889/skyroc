import type { ThemeSize } from '@skyroc/tailwind-plugin/ui';
import { tv } from 'tailwind-variants';

/** Maps size preset to track dimensions */
export const SIZE_TRACK_MAP: Record<ThemeSize, { height: number; width: number }> = {
  '2xl': { height: 28, width: 52 },
  lg: { height: 22, width: 40 },
  md: { height: 20, width: 36 },
  sm: { height: 18, width: 32 },
  xl: { height: 24, width: 44 },
  xs: { height: 16, width: 28 }
};

/** Maps size preset to thumb diameter */
export const SIZE_THUMB_MAP: Record<ThemeSize, number> = {
  '2xl': 24,
  lg: 18,
  md: 16,
  sm: 14,
  xl: 20,
  xs: 12
};

/**
 * 开关样式。
 *
 * 未选中底色直接挂在 `root` 上，选中色由 `checkedOverlay` 盖在上面做透明度过渡——两层都用语义色 token， 主题与暗色模式自动跟随，不需要在 worklet 里插值色值。
 *
 * `indicator` 槽输出的是 Uniwind 的 `accent-*` 工具类，供 ActivityIndicator 的 `colorClassName` 取色。
 *
 * 尺寸不做成 variant：轨道与滑块是像素级联动（padding、位移距离都由两者算出），走 SIZE_*_MAP 更直接。
 */
export const switchVariants = tv({
  slots: {
    checkedOverlay: 'absolute inset-0 rounded-full',
    indicator: '',
    root: 'relative rounded-full bg-muted-foreground/30',
    thumb: 'absolute items-center justify-center rounded-full bg-background shadow-sm'
  },
  variants: {
    color: {
      accent: { checkedOverlay: 'bg-accent', indicator: 'accent-accent' },
      carbon: { checkedOverlay: 'bg-carbon', indicator: 'accent-carbon' },
      destructive: { checkedOverlay: 'bg-destructive', indicator: 'accent-destructive' },
      info: { checkedOverlay: 'bg-info', indicator: 'accent-info' },
      primary: { checkedOverlay: 'bg-primary', indicator: 'accent-primary' },
      secondary: { checkedOverlay: 'bg-secondary', indicator: 'accent-secondary-foreground' },
      success: { checkedOverlay: 'bg-success', indicator: 'accent-success' },
      warning: { checkedOverlay: 'bg-warning', indicator: 'accent-warning' }
    },
    disabled: {
      true: { root: 'opacity-50' }
    }
  },
  defaultVariants: {
    color: 'primary',
    disabled: false
  }
});
