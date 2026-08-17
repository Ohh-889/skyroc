import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** Tag 默认尺寸，组件与变体共用同一份来源，避免默认值两处声明 */
export const DEFAULT_TAG_SIZE = 'md';

/**
 * Tag 样式变体。
 *
 * `text` 槽通过 TextClassContext 下发给子 Text，任意 children 都能继承标签的文字色； `closeIcon` 槽输出 Uniwind 的 `accent-*` 工具类，供矢量图标的
 * `colorClassName` 取色。
 */
export const tagVariants = tv({
  slots: {
    close: 'items-center justify-center will-change-pressable active:opacity-60',
    closeIcon: '',
    root: 'flex-row items-center',
    text: 'font-semibold'
  },
  variants: {
    variant: {
      solid: {},
      tonal: {},
      outline: { root: 'border' },
      ghost: {}
    },
    color: {
      primary: {},
      destructive: {},
      secondary: {},
      success: {},
      warning: {},
      info: {},
      // muted 在所有变体下文字色一致，直接写在变体上，无需 compound
      muted: { closeIcon: 'accent-muted-foreground', text: 'text-muted-foreground' }
    },
    size: {
      sm: { root: 'h-5 gap-0.5 px-1.5', text: 'text-[10px]' },
      md: { root: 'h-6 gap-1 px-2', text: 'text-xs' },
      lg: { root: 'h-7 gap-1 px-2.5', text: 'text-sm' }
    },
    shape: {
      rounded: { root: 'rounded-md' },
      pill: { root: 'rounded-full' },
      mark: { root: 'rounded-r-full' }
    }
  },
  compoundVariants: [
    // === solid → 底色 + foreground 文字/图标色 ===
    {
      variant: 'solid',
      color: 'primary',
      class: { closeIcon: 'accent-primary-foreground', root: 'bg-primary', text: 'text-primary-foreground' }
    },
    {
      variant: 'solid',
      color: 'destructive',
      class: { closeIcon: 'accent-destructive-foreground', root: 'bg-destructive', text: 'text-destructive-foreground' }
    },
    {
      variant: 'solid',
      color: 'secondary',
      class: { closeIcon: 'accent-secondary-foreground', root: 'bg-secondary', text: 'text-secondary-foreground' }
    },
    {
      variant: 'solid',
      color: 'success',
      class: { closeIcon: 'accent-success-foreground', root: 'bg-success', text: 'text-success-foreground' }
    },
    {
      variant: 'solid',
      color: 'warning',
      class: { closeIcon: 'accent-warning-foreground', root: 'bg-warning', text: 'text-warning-foreground' }
    },
    {
      variant: 'solid',
      color: 'info',
      class: { closeIcon: 'accent-info-foreground', root: 'bg-info', text: 'text-info-foreground' }
    },
    { variant: 'solid', color: 'muted', class: { root: 'bg-muted' } },

    // === tonal / outline / ghost → 主题色文字/图标 ===
    {
      variant: ['tonal', 'outline', 'ghost'],
      color: 'primary',
      class: { closeIcon: 'accent-primary', text: 'text-primary' }
    },
    {
      variant: ['tonal', 'outline', 'ghost'],
      color: 'destructive',
      class: { closeIcon: 'accent-destructive', text: 'text-destructive' }
    },
    {
      variant: ['tonal', 'outline', 'ghost'],
      color: 'secondary',
      class: { closeIcon: 'accent-foreground', text: 'text-foreground' }
    },
    {
      variant: ['tonal', 'outline', 'ghost'],
      color: 'success',
      class: { closeIcon: 'accent-success', text: 'text-success' }
    },
    {
      variant: ['tonal', 'outline', 'ghost'],
      color: 'warning',
      class: { closeIcon: 'accent-warning', text: 'text-warning' }
    },
    { variant: ['tonal', 'outline', 'ghost'], color: 'info', class: { closeIcon: 'accent-info', text: 'text-info' } },

    // === tonal → 低饱和底色 ===
    { variant: 'tonal', color: 'primary', class: { root: 'bg-primary/15' } },
    { variant: 'tonal', color: 'destructive', class: { root: 'bg-destructive/15' } },
    { variant: 'tonal', color: 'secondary', class: { root: 'bg-secondary/15' } },
    { variant: 'tonal', color: 'success', class: { root: 'bg-success/15' } },
    { variant: 'tonal', color: 'warning', class: { root: 'bg-warning/15' } },
    { variant: 'tonal', color: 'info', class: { root: 'bg-info/15' } },
    { variant: 'tonal', color: 'muted', class: { root: 'bg-muted/50' } },

    // === outline → 描边色 ===
    { variant: 'outline', color: 'primary', class: { root: 'border-primary' } },
    { variant: 'outline', color: 'destructive', class: { root: 'border-destructive' } },
    { variant: 'outline', color: 'secondary', class: { root: 'border-border' } },
    { variant: 'outline', color: 'success', class: { root: 'border-success' } },
    { variant: 'outline', color: 'warning', class: { root: 'border-warning' } },
    { variant: 'outline', color: 'info', class: { root: 'border-info' } },
    { variant: 'outline', color: 'muted', class: { root: 'border-border' } }
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'primary',
    size: DEFAULT_TAG_SIZE,
    shape: 'rounded'
  }
});

export type TagVariantProps = VariantProps<typeof tagVariants>;

type TagSizeKey = NonNullable<TagVariantProps['size']>;

/** 各尺寸下关闭图标的像素大小，跟随文字字号缩放 */
export const CLOSE_ICON_SIZE_MAP: Record<TagSizeKey, number> = {
  lg: 14,
  md: 12,
  sm: 10
};

/**
 * 关闭按钮补偿的触摸热区。
 *
 * 标签本身只有 20 至 28pt 高，补到 44pt 会大幅越过标签边界、与相邻标签的热区互相抢点击， 因此取到约 30pt：既高于图标本身的 10 至 14pt，又不至于溢出成片的标签列表。
 */
export const CLOSE_HIT_SLOP_MAP: Record<TagSizeKey, number> = {
  lg: 8,
  md: 9,
  sm: 10
};
