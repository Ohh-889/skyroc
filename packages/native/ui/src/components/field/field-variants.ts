import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/**
 * FieldGroup 子项间距档位 → Uniwind 间距类。
 *
 * 写成静态映射而不是 `gap-${n}` 拼接，Tailwind 扫源码时才能收到这些类名； 也因此间距只开放 Tailwind 的标准档位，避免出现半档的视觉噪声。
 */
export const FIELD_GROUP_GAP_CLASS = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12'
} as const;

/** FieldGroup 可选的子项间距档位 */
export type FieldGroupGap = keyof typeof FIELD_GROUP_GAP_CLASS;

/**
 * FieldItem 样式变体。
 *
 * `control` 是子组件的外层容器，只有存在标签时才需要与标签拉开距离， 因此它的上间距走 compoundVariants，由 `hasLabel` 与 `size` 共同决定。
 */
export const fieldItemVariants = tv({
  compoundVariants: [
    { class: { control: 'mt-2' }, hasLabel: true, size: 'lg' },
    { class: { control: 'mt-1.5' }, hasLabel: true, size: 'md' },
    { class: { control: 'mt-1' }, hasLabel: true, size: 'sm' }
  ],
  defaultVariants: {
    hasLabel: false,
    size: 'lg'
  },
  slots: {
    control: '',
    description: 'text-muted-foreground',
    extra: '',
    label: 'font-medium text-foreground',
    message: 'text-destructive',
    required: 'mr-0.5 text-destructive',
    root: ''
  },
  variants: {
    hasLabel: {
      true: {}
    },
    size: {
      lg: {
        description: 'mt-1 text-sm',
        label: 'text-lg',
        message: 'mt-1 text-sm',
        required: 'text-lg'
      },
      md: {
        description: 'mt-0.5 text-xs',
        label: 'text-base',
        message: 'mt-0.5 text-xs',
        required: 'text-base'
      },
      sm: {
        description: 'mt-0.5 text-2xs',
        label: 'text-sm',
        message: 'mt-0.5 text-2xs',
        required: 'text-sm'
      }
    }
  }
});

export type FieldItemVariantProps = VariantProps<typeof fieldItemVariants>;
