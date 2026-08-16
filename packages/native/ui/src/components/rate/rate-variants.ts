import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** Rate 默认星星数量 */
export const DEFAULT_RATE_COUNT = 5;

/** Rate 默认图标边长（px） */
export const DEFAULT_RATE_SIZE = 24;

/** Rate 默认星星间距（px） */
export const DEFAULT_RATE_GUTTER = 4;

/**
 * 星星命中区的触摸补偿。
 *
 * 单颗星默认只有 24pt，半星模式下横向命中区更是只剩一半。横向补偿会与相邻星星互抢点击， 因此只补纵向，把可点击高度抬到 44pt 附近。
 */
export const RATE_HIT_SLOP = { bottom: 10, top: 10 };

/**
 * Rate 样式变体。
 *
 * `icon` / `voidIcon` 槽输出 Uniwind 的 `accent-*` 工具类，供矢量图标的 `colorClassName` 取色，星色因此跟随主题 token 而不是硬编码 hex。
 *
 * `disabled` 声明在 `color` 之后：两者写的是同一个 tailwind 类组，后写的禁用灰会覆盖主题色。
 */
export const rateVariants = tv({
  slots: {
    icon: '',
    item: 'relative',
    root: 'flex-row items-center',
    voidIcon: 'accent-muted-foreground'
  },
  variants: {
    color: {
      accent: { icon: 'accent-accent' },
      carbon: { icon: 'accent-carbon' },
      destructive: { icon: 'accent-destructive' },
      info: { icon: 'accent-info' },
      primary: { icon: 'accent-primary' },
      // secondary 是浅底色，直接当星色几乎不可见，取前景色保证可读
      secondary: { icon: 'accent-foreground' },
      success: { icon: 'accent-success' },
      warning: { icon: 'accent-warning' }
    },
    disabled: {
      true: { icon: 'accent-muted-foreground', root: 'opacity-50' }
    }
  },
  defaultVariants: {
    color: 'warning',
    disabled: false
  }
});

export type RateVariantProps = VariantProps<typeof rateVariants>;
