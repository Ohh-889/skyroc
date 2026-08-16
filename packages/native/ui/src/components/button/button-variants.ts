import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** 按钮默认尺寸，组件与变体共用同一份来源，避免默认值两处声明 */
export const DEFAULT_BUTTON_SIZE = 'md';

/**
 * 按钮样式变体。
 *
 * `text` 槽通过 TextClassContext 下发给子 Text，任意 children 都能继承按钮的文字色； `indicator` 槽输出 Uniwind 的 `accent-*` 工具类，供 ActivityIndicator 的
 * `colorClassName` 取色——它不读 `className` 上的 `text-*`，因此必须与 `text` 槽一一对应地各维护一份。
 */
export const buttonVariants = tv({
  slots: {
    indicator: '',
    root: 'flex-row items-center justify-center will-change-pressable active:opacity-80',
    text: 'font-medium will-change-variable'
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
      muted: { indicator: 'accent-muted-foreground', text: 'text-muted-foreground' }
    },
    size: {
      sm: { root: 'h-8 gap-1.5 px-3', text: 'text-sm' },
      md: { root: 'h-10 gap-2 px-4', text: 'text-base' },
      lg: { root: 'h-14 gap-2.5 px-5', text: 'text-[17px] leading-7' },
      icon: { root: 'h-10 w-10' }
    },
    shape: {
      rounded: {},
      pill: { root: 'rounded-full' },
      circle: { root: 'rounded-full' }
    },
    block: {
      true: { root: 'w-full' }
    }
  },
  compoundVariants: [
    // === solid → 底色 + foreground 文字/指示器色 ===
    {
      variant: 'solid',
      color: 'primary',
      class: { indicator: 'accent-primary-foreground', root: 'bg-primary', text: 'text-primary-foreground' }
    },
    {
      variant: 'solid',
      color: 'destructive',
      class: { indicator: 'accent-destructive-foreground', root: 'bg-destructive', text: 'text-destructive-foreground' }
    },
    {
      variant: 'solid',
      color: 'secondary',
      class: { indicator: 'accent-secondary-foreground', root: 'bg-secondary', text: 'text-secondary-foreground' }
    },
    {
      variant: 'solid',
      color: 'success',
      class: { indicator: 'accent-success-foreground', root: 'bg-success', text: 'text-success-foreground' }
    },
    {
      variant: 'solid',
      color: 'warning',
      class: { indicator: 'accent-warning-foreground', root: 'bg-warning', text: 'text-warning-foreground' }
    },
    {
      variant: 'solid',
      color: 'info',
      class: { indicator: 'accent-info-foreground', root: 'bg-info', text: 'text-info-foreground' }
    },
    { variant: 'solid', color: 'muted', class: { root: 'bg-muted' } },

    // === tonal / outline / ghost → 主题色文字/指示器 ===
    {
      variant: ['tonal', 'outline', 'ghost'],
      color: 'primary',
      class: { indicator: 'accent-primary', text: 'text-primary' }
    },
    {
      variant: ['tonal', 'outline', 'ghost'],
      color: 'destructive',
      class: { indicator: 'accent-destructive', text: 'text-destructive' }
    },
    {
      variant: ['tonal', 'outline', 'ghost'],
      color: 'secondary',
      class: { indicator: 'accent-foreground', text: 'text-foreground' }
    },
    {
      variant: ['tonal', 'outline', 'ghost'],
      color: 'success',
      class: { indicator: 'accent-success', text: 'text-success' }
    },
    {
      variant: ['tonal', 'outline', 'ghost'],
      color: 'warning',
      class: { indicator: 'accent-warning', text: 'text-warning' }
    },
    { variant: ['tonal', 'outline', 'ghost'], color: 'info', class: { indicator: 'accent-info', text: 'text-info' } },

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
    { variant: 'outline', color: 'muted', class: { root: 'border-border' } },

    // === rounded shape × size → 圆角 ===
    { shape: 'rounded', size: 'sm', class: { root: 'rounded-lg' } },
    { shape: 'rounded', size: 'md', class: { root: 'rounded-xl' } },
    { shape: 'rounded', size: 'lg', class: { root: 'rounded-xl' } },
    { shape: 'rounded', size: 'icon', class: { root: 'rounded-xl' } },

    // circle 需要自己成立：任何尺寸下都收成正圆，而不是依赖 size="icon"
    { shape: 'circle', class: { root: 'aspect-square px-0' } }
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'primary',
    size: DEFAULT_BUTTON_SIZE,
    shape: 'rounded'
  }
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
