import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** 数字键盘样式变体 */
const numberKeyboardVariants = tv({
  slots: {
    body: 'flex-row',
    closeBtn: 'text-sm font-medium text-primary',
    header: 'flex-row items-center justify-between px-4 py-2',
    key: 'h-12 items-center justify-center rounded-lg bg-background px-0',
    keys: 'flex-[3] flex-row flex-wrap',
    root: 'rounded-t-2xl bg-muted px-1.5 pb-1.5 pt-1',
    sidebar: 'flex-1 gap-[3px] pl-[3px]',
    title: 'flex-1 text-center text-base font-medium text-foreground'
  }
});

export { numberKeyboardVariants };
export type NumberKeyboardSlots = keyof typeof numberKeyboardVariants.slots;
export type NumberKeyboardVariantProps = VariantProps<typeof numberKeyboardVariants>;
