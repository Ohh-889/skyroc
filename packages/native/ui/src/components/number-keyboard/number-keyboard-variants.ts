import { tv } from 'tailwind-variants';

/**
 * 数字键盘多 slot 样式变体。
 *
 * 间距体系：每个按键外包一层 keyWrapper（p-1 = 4px），相邻按键之间自然形成 8px 沟槽；root 与 sidebar 的内边距同样取 1，让面板外缘与沟槽宽度一致。改这里的刻度请三处一起改，
 * 否则键盘边缘会忽宽忽窄。
 *
 * 不设 defaultVariants：默认值统一由组件解构时提供，避免两处维护同一份默认行为。
 */
const numberKeyboardVariants = tv({
  slots: {
    /** 按键区与侧边栏并排 */
    body: 'flex-row',
    /** 标题栏右侧关闭按钮的文字 */
    closeBtn: 'text-sm font-medium text-primary',
    /** 侧边栏完成键（custom 主题）：占 3 份高度，与 vant 的比例一致 */
    confirmKey: 'flex-3 items-center justify-center rounded-lg px-0',
    /** 侧边栏删除键（custom 主题）：占 1 份高度，即一个普通按键的高度 */
    deleteKey: 'flex-1 items-center justify-center rounded-lg bg-background px-0 active:bg-muted',
    /** 删除 / 完成等功能键的文字，比数字小一号 */
    functionKeyText: 'text-lg',
    /** 标题栏 */
    header: 'flex-row items-center justify-between px-4 py-2',
    /** 标题栏左右两侧的等宽区域，两边同宽标题才会绝对居中 */
    headerSide: 'w-16 px-0',
    /** 网格内的单个按键 */
    key: 'h-12 items-center justify-center rounded-lg bg-background px-0 active:bg-muted',
    /** 按键网格容器 */
    keys: 'flex-row flex-wrap',
    /** 数字键的文字 */
    keyText: 'text-2xl',
    /** 按键外包层，只负责占格与沟槽；圆角和背景画在 key 上 */
    keyWrapper: 'p-1',
    /** 面板根节点：贴屏幕底部，只有上方两角是圆的 */
    root: 'rounded-t-2xl bg-muted px-1 pt-1',
    /** 右侧竖排功能区（custom 主题） */
    sidebar: 'flex-1 gap-2 py-1 pr-1',
    /** 标题 */
    title: 'flex-1 text-center text-base font-medium text-foreground'
  },
  variants: {
    /**
     * 底部安全区避让。
     *
     * 走 uniwind 的 pb-safe-or-* 而不是 useSafeAreaInsets()：后者在缺少 SafeAreaProvider 时会抛错，而键盘不该因为一个可选能力整个挂掉。安全区尺寸由应用根节点的
     * Uniwind.updateInsets 同步进来。 两个分支各写各的 pb，不要在 base 里留一个 pb-1 再叠加——pb-safe-or-1 是自定义工具类，tailwind-merge 认不出它和 pb-1 冲突，
     * 两条规则会同时生效。
     */
    safeAreaInsetBottom: {
      false: { root: 'pb-1' },
      true: { root: 'pb-safe-or-1' }
    },
    theme: {
      /** 网格让出 1/4 宽度给右侧功能区 */
      custom: { keys: 'flex-3' },
      /** 没有侧边栏，网格独占整行 */
      default: { keys: 'flex-1' }
    }
  }
});

export { numberKeyboardVariants };
