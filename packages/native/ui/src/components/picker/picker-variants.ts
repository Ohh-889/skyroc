import { tv } from 'tailwind-variants';

/** 每个选项的默认高度（px） */
export const DEFAULT_ITEM_HEIGHT = 48;

/** 默认可见选项数；必须是奇数，偶数时中心格落在两格之间，指示线会对不齐 */
export const DEFAULT_VISIBLE_COUNT = 5;

/**
 * Picker 多 slot 样式变体。
 *
 * 只有真正依赖运行时数值的属性才留在 style 里——列容器的高度、单项高度、 指示线的 top，都由 itemHeight / visibleCount 算出；其余静态样式一律走 className， 颜色统一取语义色
 * token，不写死 hex。
 */
export const pickerVariants = tv({
  slots: {
    cancel: '',
    cancelText: '',
    column: 'flex-1',
    // relative + overflow-hidden 是选中指示线能绝对定位在滚轮上的前提
    columns: 'relative flex-row overflow-hidden',
    confirm: '',
    confirmText: '',
    item: 'items-center justify-center',
    itemText: 'w-full text-center text-base text-foreground',
    loading: 'absolute inset-0 items-center justify-center bg-background/60',
    root: 'overflow-hidden rounded-2xl bg-background',
    selectedIndicator: 'absolute inset-x-0 border-y border-border/40',
    title: 'flex-1 text-center text-base font-semibold text-foreground',
    toolbar: 'flex-row items-center justify-between border-b border-border/40 py-3'
  }
});
