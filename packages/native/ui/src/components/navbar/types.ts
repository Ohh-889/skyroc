import type { ReactNode } from 'react';
import type { SlotClassNames } from '../../types';

/** NavBar 组件可覆盖的 slot 名称 */
export type NavBarSlots = 'container' | 'left' | 'right' | 'root' | 'title';

/** NavBar 导航栏组件属性 */
export interface NavBarProps {
  /** 返回箭头颜色，缺省时继承主题前景色（跟随明暗模式） */
  backColor?: string;

  /** 是否显示下边框 */
  border?: boolean;

  /** 自定义导航栏主体样式类名 */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<NavBarSlots>;

  /** 自定义左侧内容，会覆盖 leftArrow 和 leftText */
  left?: ReactNode;

  /**
   * 是否显示左侧返回箭头。
   *
   * 组件不感知路由，箭头是否可点由 onLeftPress 决定；只开 leftArrow 而不给 onLeftPress 会渲染成禁用态。
   */
  leftArrow?: boolean;

  /** 是否禁用左侧按钮 */
  leftDisabled?: boolean;

  /** 左侧文字 */
  leftText?: string;

  /** 左侧点击回调，未提供时左侧区域不可点击 */
  onLeftPress?: () => void;

  /** 右侧点击回调，未提供时右侧区域不可点击 */
  onRightPress?: () => void;

  /** 标题点击回调，未提供时标题不拦截触摸，两侧按钮照常可点 */
  onTitlePress?: () => void;

  /** 自定义右侧内容，会覆盖 rightText */
  right?: ReactNode;

  /** 是否禁用右侧按钮 */
  rightDisabled?: boolean;

  /** 右侧文字 */
  rightText?: string;

  /** 是否使用安全区域顶部内边距，默认 true */
  safeAreaTop?: boolean;

  /** 标题，支持字符串或自定义 ReactNode；字符串会单行截断 */
  title?: ReactNode;
}
