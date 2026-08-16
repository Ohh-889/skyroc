import { tv } from 'tailwind-variants';

/**
 * IndexBar 样式变体。
 *
 * 这里只有「悬浮索引条」这部分：列表本体（根节点、分组头、子项、分隔线）复用 AnchorNav 的变体， 由 IndexBar 把 `classNames` 原样透传下去，不在这里重复一份。
 *
 * `sidebar` 是绝对定位的一列，脱离常规流悬浮在列表右缘之上，所以列表需要 `content` 的右内边距让位—— 两者宽度保持一致，改一个记得改另一个。
 *
 * 索引项本身很小（20dp），横向由组件的 `hitSlop` 补足可点宽度；纵向则靠各项首尾相接来兜——所以这里 **不要加 gap**， 间隙既会漏出点不到的死区，也会让相邻项的 hitSlop 互相重叠、把点击判给隔壁字母。
 */
export const indexBarVariants = tv({
  slots: {
    content: 'pr-7',
    sidebar: 'absolute inset-y-0 right-0 w-7 items-center justify-center',
    sidebarItem: 'h-5 w-5 items-center justify-center active:opacity-80',
    sidebarItemText: 'text-xs leading-none text-muted-foreground'
  },
  variants: {
    active: {
      // 激活态只改文字本身，不加底衬：索引条悬浮在列表之上，任何色块都会挡住底下的内容
      true: {
        sidebarItemText: 'font-bold text-primary'
      }
    }
  }
});
