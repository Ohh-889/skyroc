import type { ReactNode } from 'react';
import type { SlotClassNames } from '../../types';

/** NavBar 组件可覆盖的 slot 名称 */
export type NavBarSlots = 'left' | 'right' | 'root' | 'title';

/** NavBar 导航栏组件属性 */
export interface NavBarProps {
  /** 返回箭头颜色 */
  backColor?: string;
  /** 是否显示下边框 */
  border?: boolean;

  /** 自定义容器样式类名 */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<NavBarSlots>;

  /** 自定义左侧内容，会覆盖 leftArrow 和 leftText */
  left?: ReactNode;

  /** 是否显示左侧返回箭头 */
  leftArrow?: boolean;

  /** 是否禁用左侧按钮 */
  leftDisabled?: boolean;

  /** 左侧文字 */
  leftText?: string;

  /** 左侧点击回调 */
  onLeftPress?: () => void;

  /** 右侧点击回调 */
  onRightPress?: () => void;

  /** 标题点击回调 */
  onTitlePress?: () => void;

  /** 自定义右侧内容，会覆盖 rightText */
  right?: ReactNode;

  /** 是否禁用右侧按钮 */
  rightDisabled?: boolean;

  /** 右侧文字 */
  rightText?: string;

  /** 是否使用安全区域顶部内边距，默认 true */
  safeAreaTop?: boolean;

  /** 标题，支持字符串或自定义 ReactNode */
  title?: ReactNode;
}
