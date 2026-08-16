import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** 密码输入框样式变体 */
const passwordInputVariants = tv({
  slots: {
    cell: 'flex-1 items-center justify-center bg-background',
    dot: 'rounded-full bg-foreground',
    errorInfo: 'mt-3 text-center text-sm text-destructive',
    info: 'mt-3 text-center text-sm text-muted-foreground',
    root: '',
    security: 'overflow-hidden rounded-xl',
    symbol: 'text-center text-foreground'
  },
  variants: {
    /** 合并态下用左边框分隔相邻格子，首格不需要；仅供组件内部按格子下标传入 */
    divider: {
      true: {
        cell: 'border-l'
      }
    },
    size: {
      lg: {
        cell: 'h-14',
        dot: 'h-3 w-3',
        symbol: 'text-2xl'
      },
      md: {
        cell: 'h-[50px]',
        dot: 'h-2.5 w-2.5',
        symbol: 'text-xl'
      },
      sm: {
        cell: 'h-10',
        dot: 'h-2 w-2',
        symbol: 'text-base'
      }
    },
    /** 边框色：格子区分错误 / 聚焦 / 默认，外框只区分错误态；仅供组件内部按状态传入 */
    status: {
      default: {
        cell: 'border-border',
        security: 'border-border'
      },
      error: {
        cell: 'border-destructive',
        security: 'border-destructive'
      },
      focused: {
        cell: 'border-primary',
        security: 'border-border'
      }
    },
    variant: {
      /** 格子紧贴，外框描边、内部用左边框分隔 */
      merged: {
        security: 'border'
      },
      /** 格子各自独立描边，间距由 gutter 控制 */
      separated: {
        cell: 'rounded-xl border'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    status: 'default',
    variant: 'merged'
  }
});

export { passwordInputVariants };
export type PasswordInputSlots = keyof typeof passwordInputVariants.slots;
export type PasswordInputVariantProps = VariantProps<typeof passwordInputVariants>;
