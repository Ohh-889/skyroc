import type { ReactNode, Ref } from 'react';
import type { View, ViewProps } from 'react-native';
import type { SpaceVariantProps } from './space-variants';

/** Space 对齐方式 */
export type SpaceAlign = NonNullable<SpaceVariantProps['align']>;

/** Space 间距方向 */
export type SpaceDirection = NonNullable<SpaceVariantProps['direction']>;

/** Space 间距大小预设 */
export type SpaceSize = NonNullable<SpaceVariantProps['size']>;

/** Space 组件属性 */
export interface SpaceProps extends Omit<ViewProps, 'children'> {
  /** 子元素在交叉轴上的对齐方式 */
  align?: SpaceAlign;

  /** Space 内容 */
  children: ReactNode;

  /** 自定义类名 */
  className?: string;

  /** 间距方向 */
  direction?: SpaceDirection;

  /** 是否撑满父元素宽度 */
  fill?: boolean;

  /** 底层 View 的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;

  /**
   * 间距大小，预设档位或自定义数值（数值单位 dp）。
   *
   * 传数值时走内联 style，会盖掉 className 里的 `gap-*`（RN 中 style 优先于类名），两者不要同时给。
   */
  size?: SpaceSize | number;

  /**
   * 子元素之间的分隔符，例如 `<Divider orientation="vertical" />`。
   *
   * 分隔符本身也是 flex 子项，两侧各占一份 gap——相邻子元素的实际间距是 `2 × size + 分隔符尺寸`，不是 `size`。
   */
  split?: ReactNode;

  /** 是否自动换行，仅在 direction 为 horizontal 时生效 */
  wrap?: boolean;
}
