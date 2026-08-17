import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** Search 组件样式变体（仅管外层容器 + action，输入框由 Input 负责） */
export const searchVariants = tv({
  defaultVariants: {
    shape: 'square'
  },
  slots: {
    action: 'ml-3 justify-center',
    actionText: 'text-sm text-primary',
    input: 'flex-1',
    label: 'mr-2 text-sm text-foreground',
    root: 'flex-row items-center px-3 py-2'
  },
  variants: {
    shape: {
      round: { input: 'rounded-full' },
      square: { input: 'rounded-lg' }
    }
  }
});

export type SearchVariantProps = VariantProps<typeof searchVariants>;
