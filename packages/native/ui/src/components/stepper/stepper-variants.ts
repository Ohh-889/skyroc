import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** 步进器样式变体 */
const stepperVariants = tv({
  slots: {
    input:
      'bg-transparent text-foreground font-medium flex-row items-center m-0 p-0 h-full placeholder:text-muted-foreground justify-center',
    minus: 'items-center justify-center active:opacity-70',
    minusIcon: 'font-bold leading-none',
    plus: 'items-center justify-center active:opacity-70',
    plusIcon: 'font-bold leading-none',
    root: 'flex-row items-center'
  },
  variants: {
    size: {
      lg: {
        input: 'h-10 w-16 text-base',
        minus: 'h-10 w-10',
        minusIcon: 'text-xl',
        plus: 'h-10 w-10',
        plusIcon: 'text-xl'
      },
      md: {
        input: 'h-8 w-14 text-sm',
        minus: 'h-8 w-8',
        minusIcon: 'text-lg',
        plus: 'h-8 w-8',
        plusIcon: 'text-lg'
      },
      sm: {
        input: 'h-7 w-10 text-xs',
        minus: 'h-7 w-7',
        minusIcon: 'text-base',
        plus: 'h-7 w-7',
        plusIcon: 'text-base'
      }
    },
    theme: {
      default: {
        input: 'bg-muted',
        minus: 'bg-muted',
        minusIcon: 'text-foreground',
        plus: 'bg-muted',
        plusIcon: 'text-foreground'
      },
      round: {
        minus: 'rounded-full bg-muted',
        minusIcon: 'text-foreground',
        plus: 'rounded-full bg-primary',
        plusIcon: 'text-primary-foreground'
      }
    }
  },
  compoundVariants: [
    {
      class: { minus: 'rounded-none rounded-l-lg', plus: 'rounded-none rounded-r-lg', root: 'gap-0.5' },
      theme: 'default'
    },
    { class: { root: 'gap-1.5' }, theme: 'round' }
  ],
  defaultVariants: {
    size: 'md',
    theme: 'default'
  }
});

export { stepperVariants };
export type StepperSlots = keyof typeof stepperVariants.slots;
export type StepperVariantProps = VariantProps<typeof stepperVariants>;
