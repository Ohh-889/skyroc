import { tv } from 'tailwind-variants';

/**
 * DropdownMenu 样式。
 *
 * `arrow` / `selectedIcon` 槽输出的是 Uniwind 的 `accent-*` 工具类，供 `colorClassName` 取色， 因此箭头与勾选色跟随主题 token，而不是硬编码 hex。
 *
 * `direction` 不只是定位：贴着标题栏的那一侧不加圆角，内容也从那一侧开始铺开，所以圆角、遮罩、 内容测量层三处必须一起翻转——集中在变体里，免得散成 JSX 里的三元表达式。
 */
const dropdownMenuVariants = tv({
  slots: {
    arrow: 'accent-muted-foreground',
    bar: 'flex-row items-center bg-background',
    content: 'overflow-hidden bg-background',
    divider: 'mx-4 my-0',
    /** 内容测量层：脱离动画容器的高度约束才能测出自然高度；正 z-index 压在遮罩之上（负值在 Android 上不可靠） */
    measure: 'absolute inset-x-0 z-[100]',
    option: 'h-12 flex-row items-center justify-between px-4 active:opacity-80',
    optionText: 'text-sm text-foreground',
    /** 遮罩铺满整个定位容器；容器本身就是一屏，遮罩不能比它大——超出父容器的部分在 Android 上收不到点击 */
    overlay: 'absolute inset-0 bg-black/40',
    /** 面板的定位容器：贴着标题栏、铺满一屏，向上展开时内容改从底边堆叠 */
    panel: 'absolute inset-x-0',
    root: 'relative',
    selectedIcon: 'accent-primary',
    title: 'flex-1 flex-row items-center justify-center py-3',
    titleText: 'text-sm text-muted-foreground',
    /** 高度动画容器，裁掉尚未展开的部分 */
    wrapper: 'overflow-hidden'
  },
  variants: {
    active: {
      true: {
        arrow: 'accent-primary',
        optionText: 'font-semibold text-primary',
        titleText: 'font-semibold text-primary'
      }
    },
    direction: {
      down: { content: 'rounded-b-2xl', measure: 'top-0' },
      up: { content: 'rounded-t-2xl', measure: 'bottom-0', panel: 'justify-end' }
    },
    disabled: {
      true: {
        option: 'opacity-50',
        title: 'opacity-50'
      }
    },
    opened: {
      true: {
        root: 'z-[100]'
      }
    }
  },
  defaultVariants: {
    direction: 'down'
  }
});

export { dropdownMenuVariants };
