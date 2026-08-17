import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

/** 签名组件样式变体 */
const signatureVariants = tv({
  slots: {
    canvas: 'h-[200px] overflow-hidden rounded-lg border border-dashed border-border bg-background',
    footer: 'mt-3 flex-row justify-end gap-2',
    root: '',
    tips: 'absolute inset-0 items-center justify-center',
    tipsText: 'text-sm text-muted-foreground'
  }
});

export { signatureVariants };
export type SignatureSlots = keyof typeof signatureVariants.slots;
export type SignatureVariantProps = VariantProps<typeof signatureVariants>;
