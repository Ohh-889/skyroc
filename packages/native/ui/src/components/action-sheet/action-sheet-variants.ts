import { tv } from 'tailwind-variants';

/**
 * ActionSheet 多 slot 样式变体。
 *
 * `root` 是交给 Sheet 的内容容器：Sheet 不再代为包裹内容，底部安全区也一并归内容容器， 所以 `pb-safe-or-2` 写在这里而不是面板上。
 *
 * 选中态的边框只加在 button 变体上，且基态先占一圈 `border-transparent`——只在选中时凭空多出 1px 边框， 整行的高宽会跟着跳。default 变体是纯文字列表，选中态只换文字颜色，不画边框。
 *
 * `indicator` 槽输出 Uniwind 的 `accent-*` 工具类，供 ActivityIndicator 的 `colorClassName` 取色： 它的颜色只认 `color` prop，className
 * 解析出的 `style.color` 对它无效。
 */
export const actionSheetVariants = tv({
  compoundVariants: [
    {
      class: {
        action: 'border-primary bg-primary/10'
      },
      selected: true,
      variant: 'button'
    }
  ],
  slots: {
    root: 'pb-safe-or-2',
    action: 'items-center justify-center px-4 py-3.5 will-change-pressable active:opacity-80',
    actionName: 'text-sm font-bold text-foreground',
    actionSubname: 'mt-0.5 text-xs text-muted-foreground',
    cancel: 'items-center justify-center bg-background px-4 py-3.5 will-change-pressable active:opacity-80',
    cancelGap: 'h-2 bg-muted',
    cancelName: 'text-base text-foreground',
    indicator: 'accent-muted-foreground'
  },
  variants: {
    disabled: {
      true: {
        action: 'opacity-50'
      }
    },
    loading: {
      true: {
        action: 'opacity-70'
      }
    },
    selected: {
      true: {
        actionName: 'text-primary'
      }
    },
    variant: {
      default: {},
      button: {
        root: 'gap-3 px-4',
        action:
          'flex-row items-center justify-center gap-3 rounded-xl border border-transparent bg-primary/5 px-4 py-4',
        actionName: 'text-base font-medium',
        cancel: 'rounded-xl bg-muted'
      }
    }
  }
});
