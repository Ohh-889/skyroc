import type { ReactNode } from 'react';
import type { SlotClassNames } from '../../types/shared';
import type { NumberKeyboardSlots, NumberKeyboardVariantProps } from './number-keyboard-variants';

/** 按键类型 */
type KeyType = '' | 'close' | 'delete' | 'extra';

/** 键盘主题 */
type NumberKeyboardTheme = 'custom' | 'default';

/** 按键配置 */
interface KeyConfig {
  /** 按键显示文本 */
  text: string;

  /** 按键类型 */
  type: KeyType;

  /** 是否占据两格宽度 */
  wider?: boolean;
}

/** 数字键盘组件属性 */
interface NumberKeyboardProps extends NumberKeyboardVariantProps {
  /** 关闭按钮文字（default 主题在标题栏右侧，custom 主题在侧边栏底部） */
  closeButtonText?: string;

  /** NativeWind 类名 */
  className?: string;

  /** 覆盖各插槽的 className */
  classNames?: SlotClassNames<NumberKeyboardSlots>;

  /** 删除按钮文字，不传则显示退格符号 */
  deleteButtonText?: string;

  /** 额外按键，传字符串为单个，传数组为两个（仅 custom 主题支持两个） */
  extraKey?: string | [string, string];

  /** 点击外部区域时是否关闭键盘 */
  hideOnClickOutside?: boolean;

  /** 最大输入长度 */
  maxLength?: number;

  /** 失焦事件（点击外部或关闭时触发） */
  onBlur?: () => void;

  /** 值变化回调（键盘内部管理增删） */
  onChange?: (value: string) => void;

  /** 关闭事件 */
  onClose?: () => void;

  /** 删除事件 */
  onDelete?: () => void;

  /** 输入事件（按下数字或额外键时触发） */
  onInput?: (key: string) => void;

  /** 是否随机排列数字键顺序 */
  randomKeyOrder?: boolean;

  /** 自定义删除按键内容 */
  renderDelete?: () => ReactNode;

  /** 是否适配底部安全区域 */
  safeAreaInsetBottom?: boolean;

  /** 是否显示删除按钮 */
  showDeleteKey?: boolean;

  /** 键盘主题，custom 主题带右侧边栏 */
  theme?: NumberKeyboardTheme;

  /** 键盘标题 */
  title?: string;

  /** 当前输入值（配合 onChange 使用） */
  value?: string;

  /** 是否显示键盘 */
  visible?: boolean;
}

export type { KeyConfig, KeyType, NumberKeyboardProps, NumberKeyboardTheme };
