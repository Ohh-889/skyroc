import { tv } from 'tailwind-variants';

/**
 * Dialog 主体多 slot 样式变体
 *
 * Popup slot 落在外层 Popup 上：宽度用「百分比 + 最大宽度」而不是纯百分比，大屏上 80% 会把一句话的提示拉成横贯屏幕的长条。
 */
export const dialogVariants = tv({
  slots: {
    body: 'gap-3 px-6',
    header: 'px-6 pt-6',
    message: 'text-sm leading-5',
    popup: 'w-[85%] max-w-[320px]',
    root: 'overflow-hidden rounded-2xl bg-background',
    title: 'text-center text-lg font-semibold text-foreground'
  },
  variants: {
    hasTitle: {
      // 没有标题时正文自己就是主信息，用前景色和更大的字号；有标题时才退成灰色辅助文案
      false: { body: 'py-6', message: 'text-base leading-6 text-foreground' },
      true: { body: 'pb-6 pt-2', message: 'text-muted-foreground' }
    },
    messageAlign: {
      center: { message: 'text-center' },
      left: { message: 'text-left' },
      right: { message: 'text-right' }
    }
  },
  defaultVariants: {
    hasTitle: false,
    messageAlign: 'center'
  }
});

/**
 * Dialog 底部操作区样式变体
 *
 * Default 主题的按钮要拉通到卡片边缘：清掉 Button 自带的圆角，交给根节点的 overflow-hidden 统一裁出底部圆角， 否则按下时的高亮会是一块缩在角落里、和卡片圆角对不齐的方块。
 *
 * Direction 只在 round-button 主题下生效：default 主题的通栏文字按钮永远横排，竖排会退化成两条色带。
 */
export const dialogFooterVariants = tv({
  slots: {
    button: '',
    root: 'flex-row'
  },
  variants: {
    direction: {
      horizontal: {},
      vertical: {}
    },
    theme: {
      default: { button: 'h-12 flex-1 rounded-none' },
      'round-button': { button: 'h-11', root: 'gap-3 px-6 pb-6 pt-2' }
    }
  },
  compoundVariants: [
    // 竖排用 column-reverse：渲染顺序统一为「取消 → 确定」，横排时确定自然落在右侧，
    // 竖排时又能保持确定在上方，两种方向共用一份 JSX 而不用把按钮写两遍
    {
      class: { button: 'w-full', root: 'flex-col-reverse' },
      direction: 'vertical',
      theme: 'round-button'
    },
    {
      class: { button: 'flex-1' },
      direction: 'horizontal',
      theme: 'round-button'
    }
  ],
  defaultVariants: {
    direction: 'vertical',
    theme: 'default'
  }
});
