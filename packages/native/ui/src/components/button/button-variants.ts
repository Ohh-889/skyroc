import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

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

    // === tonal × color ===
    { variant: 'tonal', color: 'primary', class: 'bg-primary/15' },
    { variant: 'tonal', color: 'destructive', class: 'bg-destructive/15' },
    { variant: 'tonal', color: 'secondary', class: 'bg-secondary/15' },
    { variant: 'tonal', color: 'success', class: 'bg-success/15' },
    { variant: 'tonal', color: 'warning', class: 'bg-warning/15' },
    { variant: 'tonal', color: 'info', class: 'bg-info/15' },

    // === outline × color ===
    { variant: 'outline', color: 'primary', class: 'border-primary' },
    { variant: 'outline', color: 'destructive', class: 'border-destructive' },
    { variant: 'outline', color: 'secondary', class: 'border-border' },
    { variant: 'outline', color: 'success', class: 'border-success' },
    { variant: 'outline', color: 'warning', class: 'border-warning' },
    { variant: 'outline', color: 'info', class: 'border-info' },

    // === rounded shape × size → border radius ===
    { shape: 'rounded', size: 'sm', class: 'rounded-lg' },
    { shape: 'rounded', size: 'md', class: 'rounded-xl' },
    { shape: 'rounded', size: 'lg', class: 'rounded-xl' },
    { shape: 'rounded', size: 'icon', class: 'rounded-xl' }
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'primary',
    size: 'md',
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
      muted: ''
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
    { variant: ['tonal', 'outline', 'ghost'], color: 'info', class: 'text-info' },
    { variant: ['tonal', 'outline', 'ghost'], color: 'muted', class: 'text-muted-foreground' }
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'primary',
    size: 'md'
  }
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
