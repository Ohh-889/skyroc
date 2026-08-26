import { tv } from 'tailwind-variants';

export const treeVariants = tv({
  slots: {
    root: [],
    item: [''],
    itemIndicator: ['flex items-center justify-center', 'shrink-0', 'transition-transform duration-200', 'data-[expanded]:rotate-90'],
    itemChildren: ['flex flex-col'],
    virtualContainer: ['relative overflow-auto'],
    virtualContent: ['relative']
  }
});

export type TreeSlots = keyof typeof treeVariants.slots;

export function getIndentStyle(level: number, indentSize: number = 16): React.CSSProperties {
  return { paddingLeft: `${(level - 1) * indentSize}px` };
}
