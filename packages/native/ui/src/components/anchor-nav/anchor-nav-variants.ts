import { tv } from 'tailwind-variants';

/**
 * AnchorNav 样式变体。
 *
 * 子项与分组头的高度**不写在这里**：这两个值同时是滚动定位的度量，只能有一个来源， 由组件按 `itemHeight` / `sectionHeaderHeight` 以 style 注入。所以这里的 `item` /
 * `sectionHeader` 只管内边距、颜色与排布，纵向一律交给 justify/items 居中，不要再加 `py-*`。
 *
 * `sidebar` 两件事缺一不可：
 *
 * - `w-20 shrink-0 grow-0`：约束落在 Sidebar 外层的普通 View 上，隔离 RN Web 给竖向 ScrollView 注入的 `flexGrow: 1, flexShrink: 1`。否则两侧都是
 *   ScrollView 时会按内容基准瓜分宽度，侧栏被撑肥、内容区被挤窄；需要别的宽度由调用方通过 `classNames.sidebar` 覆盖。
 * - `self-stretch`：Sidebar 自己的根节点是 `self-start`（独立使用时贴合内容高度），落到 AnchorNav 的横向布局里 必须撑满，否则短侧栏铺不满底色、长侧栏也滚不动。
 */
export const anchorNavVariants = tv({
  slots: {
    content: 'flex-1 bg-background',
    item: 'flex-row items-center gap-3 px-3 active:opacity-80',
    itemText: 'flex-1 text-sm text-foreground',
    root: 'flex-1 flex-row',
    sectionHeader: 'justify-center bg-muted/50 px-3',
    sectionHeaderText: 'text-xs font-semibold text-muted-foreground',
    // Divider 默认带 my-2，这里必须清零：分隔线的实际占位高度要和滚动定位的高度模型完全一致
    separator: 'mx-3 my-0',
    sidebar: 'w-20 shrink-0 grow-0 self-stretch'
  }
});
