import { tv } from 'tailwind-variants';

/**
 * NavBar 多 slot 样式变体。
 *
 * 不设 defaultVariants：默认值统一由组件解构时提供，避免两处维护同一份默认行为。
 */
export const navBarVariants = tv({
  slots: {
    /** 最外层容器：承载顶部安全区内边距，保证刘海区与导航栏同底色 */
    container: 'bg-background',
    /** 导航栏主体：iOS 惯例 44pt，Android Material 顶栏 56dp */
    root: 'relative h-11 android:h-14 flex-row items-center justify-between px-safe-or-4',
    /** 绝对定位居中，左右预留按钮区，避免长标题压住两侧内容 */
    title: 'absolute inset-y-0 inset-x-16 items-center justify-center',
    left: 'z-10 flex-row items-center gap-1',
    right: 'z-10 flex-row items-center gap-1'
  },
  variants: {
    border: {
      true: {
        root: 'border-b border-border'
      }
    },
    safeAreaTop: {
      true: {
        container: 'pt-safe'
      }
    },
    leftDisabled: {
      true: {
        left: 'opacity-50'
      }
    },
    rightDisabled: {
      true: {
        right: 'opacity-50'
      }
    }
  }
});
