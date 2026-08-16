import type { ComponentType, Ref } from 'react';
import type { CodeFieldProps } from 'react-native-confirmation-code-field';
import type { TextInput, TextInputProps } from 'react-native';
import type { SlotClassNames } from '../../types/shared';
import type { PasswordInputSlots, PasswordInputVariantProps } from './password-input-variants';

/**
 * 密码输入框组件属性
 *
 * 继承 CodeFieldProps 以透传底层 TextInput 属性（keyboardType、returnKeyType 等）。
 * divider / status 是组件按格子下标与聚焦态内部计算的样式变体，不对外开放。
 */
interface PasswordInputProps
  extends Omit<CodeFieldProps, 'defaultValue' | 'onChangeText' | 'ref' | 'renderCell' | 'style' | 'value'>,
    Pick<PasswordInputVariantProps, 'size' | 'variant'> {
  /** 根节点类名 */
  className?: string;

  /** 覆盖各插槽的 className */
  classNames?: SlotClassNames<PasswordInputSlots>;

  /** 替换底层输入组件，用于接入 BottomSheetTextInput 等自定义 TextInput */
  component?: ComponentType<TextInputProps>;

  /** 默认值（非受控模式） */
  defaultValue?: string;

  /** 输入框下方错误提示（优先于 info 显示，同时把边框置为错误色） */
  errorInfo?: string;

  /** 格子间距（像素），仅 variant 为 separated 时生效 */
  gutter?: number;

  /** 输入框下方提示信息 */
  info?: string;

  /** 密码长度（格子数量） */
  length?: number;

  /** 是否隐藏输入内容（以圆点代替字符） */
  mask?: boolean;

  /** 值变化回调，语义与 RN TextInput 的 onChangeText 一致 */
  onChangeText?: (value: string) => void;

  /** 输入完成（长度达到 length）时触发 */
  onComplete?: (value: string) => void;

  /**
   * 承接触摸的那个底层 TextInput 的 ref。
   *
   * PasswordInput 自己也要用它做输满自动失焦，所以内外两个 ref 用 useComposedRefs 合成； 拿到后可以调 focus / blur / clear 等 TextInput 原生方法，不必再包一层窄接口。
   */
  ref?: Ref<TextInput>;

  /** 当前输入值（受控模式） */
  value?: string;
}

export type { PasswordInputProps };
