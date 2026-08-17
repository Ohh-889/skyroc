import { tv } from 'tailwind-variants';

/**
 * BackTop 样式。
 *
 * `icon` 槽输出的是 Uniwind 的 `accent-*` 工具类，供 `colorClassName` 取色， 因此默认箭头跟着 FloatingButton 的 `bg-primary` 取前景色，而不是硬编码白色。
 */
const backTopVariants = tv({
  slots: {
    icon: 'accent-primary-foreground'
  }
});

export { backTopVariants };
