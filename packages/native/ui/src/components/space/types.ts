import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';

/** 间距大小预设 */
export type SpaceSize = 'lg' | 'md' | 'sm' | 'xl' | 'xs';

/** Space 组件属性 */
export interface SpaceProps extends Omit<ViewProps, 'children'> {
  /** 设置子元素的对齐方式 */
  align?: 'baseline' | 'center' | 'end' | 'start';

  /** Space 内容 */
  children: ReactNode;

  /** 自定义类名 */
  className?: string;

  /** 间距方向 */
  direction?: 'horizontal' | 'vertical';

  /** 是否填充整个父元素宽度 */
  fill?: boolean;

  /** 间距大小，支持预设或自定义数值（单位 px） */
  size?: SpaceSize;

  /** 是否自动换行，仅适用于水平方向 */
  wrap?: boolean;
}
