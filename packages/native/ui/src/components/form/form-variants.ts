import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';
import type { CellSize } from '../cell/cell-variants';

/**
 * 左右布局下提示行的左缩进：Cell 的左内边距 + 标签与内容之间的 `mr-3`。
 *
 * 加上标签列宽度才是提示文案的起点，这样错误 / 描述与输入区左对齐。 跟随 size 取值，避免 sm 尺寸下沿用大号的缩进。
 */
export const FORM_ITEM_EXTRA_INDENT: Record<CellSize, number> = {
  lg: 28,
  md: 28,
  sm: 24
};

/**
 * Form.Item 样式变体。
 *
 * `cell` 是内层 Cell 的根节点：背景由外层 root 统一给出，Cell 自身保持透明； 左右布局把提示行拆到 Cell 外面时，还要交出底部内边距（`extraOutside`）。
 */
export const formItemVariants = tv({
  defaultVariants: {
    arrow: false,
    error: false,
    extraOutside: false,
    size: 'md'
  },
  slots: {
    cell: 'bg-transparent',
    /** 控件所在的区域，右对齐 Switch / Rate 这类控件时改它 */
    control: '',
    description: 'text-muted-foreground',
    extra: '',
    /** 左右布局下提示独占一行时的外层容器，纯结构类，不开放给调用方覆盖 */
    extraRow: '',
    label: 'text-foreground',
    /** 必填星号与标签的排列容器，纯结构类，不开放给调用方覆盖 */
    labelRow: 'flex-row items-center',
    message: 'font-medium text-destructive',
    required: 'mr-0.5 text-destructive',
    root: 'bg-background overflow-hidden'
  },
  variants: {
    arrow: {
      true: {
        extraRow: 'pr-8'
      }
    },
    error: {
      true: {
        label: 'text-destructive'
      }
    },
    extraOutside: {
      true: {
        cell: 'min-h-0 pb-0'
      }
    },
    size: {
      lg: {
        description: 'mt-1 text-sm',
        extraRow: 'px-4 pb-3.5',
        label: 'text-lg',
        message: 'mt-1 text-sm'
      },
      md: {
        description: 'mt-0.5 text-xs',
        extraRow: 'px-4 pb-3',
        label: 'text-base',
        message: 'mt-0.5 text-xs'
      },
      sm: {
        description: 'mt-0.5 text-2xs',
        extraRow: 'px-3 pb-2',
        label: 'text-sm',
        message: 'mt-0.5 text-2xs'
      }
    }
  }
});

export type FormItemVariantProps = VariantProps<typeof formItemVariants>;
