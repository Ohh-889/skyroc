import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** 按钮默认尺寸，组件与变体共用同一份来源，避免默认值两处声明 */
export const DEFAULT_BUTTON_SIZE = 'md';

/** 按钮容器样式变体 */
export const buttonVariants = tv({
  base: 'flex-row items-center justify-center will-change-pressable active:opacity-80',
  variants: {
    variant: {
      solid: '',
      tonal: '',
      outline: 'border',
      ghost: ''
    },
    color: {
      primary: '',
      destructive: '',
      secondary: '',
      success: '',
      warning: '',
      info: '',
      muted: ''
    },
    size: {
      sm: 'h-8 px-3 gap-1.5',
      md: 'h-10 px-4 gap-2',
      lg: 'h-14 px-5 gap-2.5',
      icon: 'h-10 w-10'
    },
    shape: {
      rounded: '',
      pill: 'rounded-full',
      circle: 'rounded-full'
    },
    block: {
      true: 'w-full'
    }
  },
  compoundVariants: [
    // === solid × color ===
    { variant: 'solid', color: 'primary', class: 'bg-primary' },
    { variant: 'solid', color: 'destructive', class: 'bg-destructive' },
    { variant: 'solid', color: 'secondary', class: 'bg-secondary' },
    { variant: 'solid', color: 'success', class: 'bg-success' },
    { variant: 'solid', color: 'warning', class: 'bg-warning' },
    { variant: 'solid', color: 'info', class: 'bg-info' },
    { variant: 'solid', color: 'muted', class: 'bg-muted' },

    // === tonal × color ===
    { variant: 'tonal', color: 'primary', class: 'bg-primary/15' },
    { variant: 'tonal', color: 'destructive', class: 'bg-destructive/15' },
    { variant: 'tonal', color: 'secondary', class: 'bg-secondary/15' },
    { variant: 'tonal', color: 'success', class: 'bg-success/15' },
    { variant: 'tonal', color: 'warning', class: 'bg-warning/15' },
    { variant: 'tonal', color: 'info', class: 'bg-info/15' },
    { variant: 'tonal', color: 'muted', class: 'bg-muted/50' },

    // === outline × color ===
    { variant: 'outline', color: 'primary', class: 'border-primary' },
    { variant: 'outline', color: 'destructive', class: 'border-destructive' },
    { variant: 'outline', color: 'secondary', class: 'border-border' },
    { variant: 'outline', color: 'success', class: 'border-success' },
    { variant: 'outline', color: 'warning', class: 'border-warning' },
    { variant: 'outline', color: 'info', class: 'border-info' },
    { variant: 'outline', color: 'muted', class: 'border-border' },

    // === rounded shape × size → border radius ===
    { shape: 'rounded', size: 'sm', class: 'rounded-lg' },
    { shape: 'rounded', size: 'md', class: 'rounded-xl' },
    { shape: 'rounded', size: 'lg', class: 'rounded-xl' },
    { shape: 'rounded', size: 'icon', class: 'rounded-xl' },

    // circle 需要自己成立：任何尺寸下都收成正圆，而不是依赖 size="icon"
    { shape: 'circle', class: 'aspect-square px-0' }
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'primary',
    size: DEFAULT_BUTTON_SIZE,
    shape: 'rounded'
  }
});

/** 按钮文字样式变体，通过 TextClassContext 传递给子 Text 组件 */
export const buttonTextVariants = tv({
  base: 'font-medium will-change-variable',
  variants: {
    variant: {
      solid: '',
      tonal: '',
      outline: '',
      ghost: ''
    },
    color: {
      primary: '',
      destructive: '',
      secondary: '',
      success: '',
      warning: '',
      info: '',
      // muted 在所有变体下文字色一致，直接写在变体上，无需 compound
      muted: 'text-muted-foreground'
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-[17px] leading-7',
      icon: ''
    }
  },
  compoundVariants: [
    // === solid → foreground 色 ===
    { variant: 'solid', color: 'primary', class: 'text-primary-foreground' },
    { variant: 'solid', color: 'destructive', class: 'text-destructive-foreground' },
    { variant: 'solid', color: 'secondary', class: 'text-secondary-foreground' },
    { variant: 'solid', color: 'success', class: 'text-success-foreground' },
    { variant: 'solid', color: 'warning', class: 'text-warning-foreground' },
    { variant: 'solid', color: 'info', class: 'text-info-foreground' },

    // === tonal / outline / ghost → 主题色文字 ===
    { variant: ['tonal', 'outline', 'ghost'], color: 'primary', class: 'text-primary' },
    { variant: ['tonal', 'outline', 'ghost'], color: 'destructive', class: 'text-destructive' },
    { variant: ['tonal', 'outline', 'ghost'], color: 'secondary', class: 'text-foreground' },
    { variant: ['tonal', 'outline', 'ghost'], color: 'success', class: 'text-success' },
    { variant: ['tonal', 'outline', 'ghost'], color: 'warning', class: 'text-warning' },
    { variant: ['tonal', 'outline', 'ghost'], color: 'info', class: 'text-info' }
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'primary',
    size: DEFAULT_BUTTON_SIZE
  }
});

/**
 * 加载指示器颜色变体。
 *
 * Uniwind 的 ActivityIndicator 只从 `colorClassName` 的 `accent-*` 工具类取色， 不读 `className` 上的 `text-*`，因此必须单独维护一份与
 * buttonTextVariants 对应的 accent 色。
 */
export const buttonIndicatorVariants = tv({
  variants: {
    variant: {
      solid: '',
      tonal: '',
      outline: '',
      ghost: ''
    },
    color: {
      primary: '',
      destructive: '',
      secondary: '',
      success: '',
      warning: '',
      info: '',
      muted: 'accent-muted-foreground'
    }
  },
  compoundVariants: [
    // === solid → foreground 色 ===
    { variant: 'solid', color: 'primary', class: 'accent-primary-foreground' },
    { variant: 'solid', color: 'destructive', class: 'accent-destructive-foreground' },
    { variant: 'solid', color: 'secondary', class: 'accent-secondary-foreground' },
    { variant: 'solid', color: 'success', class: 'accent-success-foreground' },
    { variant: 'solid', color: 'warning', class: 'accent-warning-foreground' },
    { variant: 'solid', color: 'info', class: 'accent-info-foreground' },

    // === tonal / outline / ghost → 主题色 ===
    { variant: ['tonal', 'outline', 'ghost'], color: 'primary', class: 'accent-primary' },
    { variant: ['tonal', 'outline', 'ghost'], color: 'destructive', class: 'accent-destructive' },
    { variant: ['tonal', 'outline', 'ghost'], color: 'secondary', class: 'accent-foreground' },
    { variant: ['tonal', 'outline', 'ghost'], color: 'success', class: 'accent-success' },
    { variant: ['tonal', 'outline', 'ghost'], color: 'warning', class: 'accent-warning' },
    { variant: ['tonal', 'outline', 'ghost'], color: 'info', class: 'accent-info' }
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'primary'
  }
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
