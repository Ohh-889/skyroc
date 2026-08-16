import { tv } from 'tailwind-variants';

/**
 * Sheet 多 slot 样式变体。
 *
 * `background` 是面板本体的底色与圆角，通过 backgroundComponent 交给 gorhom 定位； `chrome` 是顶部固定区（handle + header +
 * description），作为 handleComponent 由 gorhom 单独测高； 内容区不在这里——它由调用方自己提供容器，Sheet 不参与。 `closeIcon` 槽输出 Uniwind 的
 * `accent-*` 工具类，供矢量图标的 `colorClassName` 取色。
 */
export const sheetVariants = tv({
  slots: {
    background: 'rounded-t-2xl bg-background',
    chrome: 'pb-4',
    handle: 'items-center py-2',
    handleBar: 'h-1 w-8 rounded-full bg-muted-foreground/30',
    // min-h-8 保证没有 title 时 header 仍有高度，否则绝对定位的关闭按钮会压到下方内容上
    header: 'relative min-h-8 items-center justify-center px-4',
    title: 'text-center text-lg font-semibold text-foreground',
    description: 'px-6 pt-2 text-center text-sm text-muted-foreground',
    close:
      'absolute right-4 top-1 size-6 items-center justify-center rounded-full bg-muted will-change-pressable active:opacity-70',
    closeIcon: 'accent-muted-foreground'
  }
});
