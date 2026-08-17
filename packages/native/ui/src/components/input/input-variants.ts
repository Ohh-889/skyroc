import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** 各尺寸下功能图标（清除、密码切换）的像素尺寸，图标库只认 size prop，无法用工具类表达 */
export const INPUT_ICON_SIZE_MAP = {
  lg: 22,
  md: 20,
  sm: 18
} as const;

/**
 * Input 样式变体。
 *
 * `error` / `focused` 的边框色一律走 compoundVariants：tv 按 `variants` 的声明顺序拼接类名， `variant` 声明在后，它的 `border-input` /
 * `border-transparent` 会在 tailwind-merge 阶段 覆盖掉写在 `error` 上的 `border-destructive`，导致错误态无边框可见。 compoundVariants 拼在所有
 * variants 之后，才能保证优先级为 error > focused > variant。
 *
 * `actionIcon` 槽输出的是 Uniwind 的 `accent-*` 工具类，供 `colorClassName` 取色， 因此图标颜色跟随主题 token，而非硬编码灰值。
 */
export const inputVariants = tv({
  defaultVariants: {
    size: 'md',
    variant: 'outline'
  },
  slots: {
    action: 'items-center justify-center',
    actionIcon: 'accent-muted-foreground',
    control: 'm-0 h-full flex-1 p-0 text-foreground placeholder:text-muted-foreground',
    root: 'flex-row items-center bg-background'
  },
  variants: {
    disabled: {
      true: { root: 'opacity-50' }
    },
    error: {
      // 边框色见 compoundVariants
      true: {}
    },
    focused: {
      // 边框色见 compoundVariants
      true: {}
    },
    // 字号一律走 `text-(length:--text-*)` 而不是 `text-sm` / `text-base` 简写：
    // 简写会连带输出 `line-height`，Uniwind 把它换算成绝对 lineHeight 传给 RN，
    // iOS 的 NSParagraphStyle 在强制行高时把多出的空间全加在文字上方，
    // 文字于是贴着行框底部，表现为「输入框里文字偏下、不上下居中」。
    // 单行输入不需要行高，只给 fontSize，让 iOS 按控件高度自然居中。
    size: {
      lg: { control: 'text-(length:--text-lg)', root: 'h-16 gap-2.5 rounded-xl px-4' },
      md: { control: 'text-(length:--text-base)', root: 'h-12 gap-2 rounded-lg px-3' },
      sm: { control: 'text-(length:--text-sm)', root: 'h-10 gap-1.5 rounded-md px-2' }
    },
    variant: {
      filled: { root: 'border border-transparent bg-muted' },
      none: { root: 'h-auto gap-0 rounded-none border-0 bg-transparent p-0' },
      outline: { root: 'border border-input' },
      underline: { root: 'rounded-none border-b border-input' }
    }
  },
  compoundVariants: [
    // === 聚焦边框 ===
    { class: { root: 'border-primary' }, focused: true, variant: 'outline' },
    { class: { root: 'border-primary' }, focused: true, variant: 'filled' },
    { class: { root: 'border-primary' }, focused: true, variant: 'underline' },

    // === 错误边框，排在聚焦之后 → 出错时始终压过聚焦色 ===
    { class: { root: 'border-destructive' }, error: true, variant: 'outline' },
    { class: { root: 'border-destructive' }, error: true, variant: 'filled' },
    { class: { root: 'border-destructive' }, error: true, variant: 'underline' }
  ]
});

export type InputVariantProps = VariantProps<typeof inputVariants>;
