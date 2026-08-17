import { tv } from 'tailwind-variants';

/**
 * PickerGroup 多 slot 样式变体。
 *
 * tab 的激活态走 active variant，而不是在 JSX 里拼类名字符串——与 tabsVariants 保持同一套写法， 调用方覆盖 tabText 时才不会被硬编码的激活样式盖掉。
 */
export const pickerGroupVariants = tv({
  slots: {
    activeIndicator: 'absolute inset-x-0 bottom-0 h-0.5 bg-primary',
    cancel: '',
    cancelText: '',
    confirm: '',
    confirmText: '',
    root: 'bg-background',
    tab: 'flex-1 items-center justify-center py-3',
    tabBar: 'flex-row border-b border-border/40',
    tabText: 'text-sm text-muted-foreground',
    toolbar: 'flex-row items-center justify-between border-b border-border/40 py-3'
  },
  variants: {
    active: {
      true: {
        tabText: 'font-semibold text-primary'
      }
    }
  }
});
