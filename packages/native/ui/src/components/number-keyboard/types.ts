import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SlotClassNames } from '../../types';

/** 数字键盘可覆盖的样式插槽 */
type NumberKeyboardSlots =
  | 'body'
  | 'closeBtn'
  | 'confirmKey'
  | 'deleteKey'
  | 'functionKeyText'
  | 'header'
  | 'headerSide'
  | 'key'
  | 'keys'
  | 'keyText'
  | 'keyWrapper'
  | 'root'
  | 'sidebar'
  | 'title';

/**
 * 按键类型。
 *
 * 其中 placeholder 只占格不渲染按钮，用于 extraKey / 删除键缺席时把网格撑成完整的 4×3。
 */
type KeyType = 'delete' | 'extra' | 'normal' | 'placeholder';

/** 键盘主题 */
type NumberKeyboardTheme = 'custom' | 'default';

/** 按键配置 */
interface KeyConfig {
  /** 按键显示文本；delete / placeholder 不读这个字段 */
  text: string;

  /** 按键类型 */
  type: KeyType;

  /** 是否占据两格宽度 */
  wider?: boolean;
}

/**
 * 解析完成的插槽类名。
 *
 * 由 NumberKeyboard 一次算好后整份下发给子组件：子组件各自调一次 tv 不仅重复计算，还拿不到只有父组件知道的 theme，算出来的 keys 槽会是错的。
 */
type ResolvedSlotClassNames = Record<NumberKeyboardSlots, string>;

/** 数字键盘组件属性 */
interface NumberKeyboardProps {
  /** 覆盖面板根节点的 className */
  className?: string;

  /** 覆盖各插槽的 className */
  classNames?: SlotClassNames<NumberKeyboardSlots>;

  /** 关闭按钮文字。default 主题只有传了才会显示标题栏右侧的关闭按钮；custom 主题不传则用「完成」 */
  closeButtonText?: string;

  /** 删除按钮文字，不传则显示退格符号 */
  deleteButtonText?: string;

  /** 额外按键，传字符串为单个，传数组为两个（仅 custom 主题支持两个） */
  extraKey?: string | [string, string];

  /** 点击键盘外部时是否触发 onBlur。为 false 时下层内容保持可点，键盘不做模态遮挡 */
  hideOnClickOutside?: boolean;

  /** 最大输入长度 */
  maxLength?: number;

  /** 失焦事件（点击外部或关闭时触发） */
  onBlur?: () => void;

  /** 值变化回调，增删由键盘内部算好后给出完整新值 */
  onChange?: (value: string) => void;

  /** 关闭事件 */
  onClose?: () => void;

  /** 删除事件 */
  onDelete?: () => void;

  /** 输入事件（按下数字或额外键时触发） */
  onInput?: (key: string) => void;

  /** 是否随机排列数字键顺序，每次打开重新洗牌 */
  randomKeyOrder?: boolean;

  /** 自定义删除按键内容 */
  renderDelete?: () => ReactNode;

  /** 是否适配底部安全区域 */
  safeAreaInsetBottom?: boolean;

  /** 是否显示删除按钮 */
  showDeleteKey?: boolean;

  /** 面板根节点的原生样式覆盖 */
  style?: StyleProp<ViewStyle>;

  /** 键盘主题，custom 主题带右侧边栏 */
  theme?: NumberKeyboardTheme;

  /** 键盘标题 */
  title?: string;

  /**
   * 当前输入值。
   *
   * 传了即为受控，长度限制与增删都以它为准；不传则由键盘自己持有输入值，仍会通过 onChange 把完整新值抛出来。
   */
  value?: string;

  /** 是否显示键盘 */
  visible?: boolean;
}

export type {
  KeyConfig,
  KeyType,
  NumberKeyboardProps,
  NumberKeyboardSlots,
  NumberKeyboardTheme,
  ResolvedSlotClassNames
};
