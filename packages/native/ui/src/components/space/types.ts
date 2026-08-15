import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';
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

  /** 间距大小，预设档位或自定义数值（数值单位 dp，通过内联 style 应用） */
  size?: SpaceSize | number;

  /** 子元素之间的分隔符，例如 <Divider orientation="vertical" /> */
  split?: ReactNode;

  /** 是否自动换行，仅在 direction 为 horizontal 时生效 */
  wrap?: boolean;
}
