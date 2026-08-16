import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** 日历样式变体 */
const calendarVariants = tv({
  slots: {
    root: 'rounded-2xl bg-background p-4'
  }
});

export { calendarVariants };
export type CalendarSlots = keyof typeof calendarVariants.slots;
export type CalendarVariantProps = VariantProps<typeof calendarVariants>;
