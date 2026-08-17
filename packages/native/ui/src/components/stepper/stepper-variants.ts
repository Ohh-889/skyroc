import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/**
 * 步进器样式变体。
 *
 * `input` 槽的字号走 `text-(length:--text-*)` 而不是 `text-sm` 简写：简写会连带输出 `line-height`，
 * Uniwind 换算成绝对 lineHeight 传给 RN，iOS 的 NSParagraphStyle 在强制行高时把多出的空间全加在
 * 文字上方，表现为输入框里数字偏下。单行数值不需要行高，只给 fontSize 让其按控件高度自然居中。
 * 同 `input-variants.ts`。
 */
const stepperVariants = tv({
  slots: {
    input: 'bg-transparent text-foreground font-medium m-0 p-0 h-full placeholder:text-muted-foreground',
    minus: 'items-center justify-center active:opacity-70',
    minusIcon: 'font-bold leading-none',
    plus: 'items-center justify-center active:opacity-70',
    plusIcon: 'font-bold leading-none',
    root: 'flex-row items-center'
  },
  variants: {
    size: {
      lg: {
        input: 'h-10 w-16 text-(length:--text-base)',
        minus: 'h-10 w-10',
        minusIcon: 'text-xl',
        plus: 'h-10 w-10',
        plusIcon: 'text-xl'
      },
      md: {
        input: 'h-8 w-14 text-(length:--text-sm)',
        minus: 'h-8 w-8',
        minusIcon: 'text-lg',
        plus: 'h-8 w-8',
        plusIcon: 'text-lg'
      },
      sm: {
        input: 'h-7 w-10 text-(length:--text-xs)',
        minus: 'h-7 w-7',
        minusIcon: 'text-base',
        plus: 'h-7 w-7',
        plusIcon: 'text-base'
      }
    },
    theme: {
      // 连体式：三段贴合成一条，靠 rounded-none 压掉 Button 自带的圆角
      default: {
        input: 'bg-muted',
        minus: 'rounded-none rounded-l-lg bg-muted',
        minusIcon: 'text-foreground',
        plus: 'rounded-none rounded-r-lg bg-muted',
        plusIcon: 'text-foreground',
        root: 'gap-0.5'
      },
      // 分离式：两枚圆钮 + 无底色输入框
      round: {
        input: 'bg-transparent',
        minus: 'rounded-full bg-muted',
        minusIcon: 'text-foreground',
        plus: 'rounded-full bg-primary',
        plusIcon: 'text-primary-foreground',
        root: 'gap-1.5'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    theme: 'default'
  }
});

export { stepperVariants };
export type StepperSlots = keyof typeof stepperVariants.slots;
export type StepperVariantProps = VariantProps<typeof stepperVariants>;
