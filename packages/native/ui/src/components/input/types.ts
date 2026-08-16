import type { ComponentType, ReactNode, Ref, RefAttributes } from 'react';
import type { TextInput, TextInputProps } from 'react-native';
import type { SlotClassNames } from '../../types';
import type { InputVariantProps } from './input-variants';

/** Input slot 名称，`action` 为清除 / 密码切换按钮共用的槽 */
export type InputSlots = 'action' | 'control' | 'root';

/** 输入框类型 */
export type InputType = 'password' | 'text';

/** Input 组件属性 */
export interface InputProps extends Omit<TextInputProps, 'editable' | 'secureTextEntry'>, InputVariantProps {
  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的 className */
  classNames?: SlotClassNames<InputSlots>;

  /** 是否可清除，有值时在尾部显示清除按钮 */
  clearable?: boolean;

  /** 自定义输入组件，默认 TextInput。在 Sheet 内使用时传 BottomSheetTextInput */
  component?: ComponentType<TextInputProps & RefAttributes<TextInput>>;

  /** 密码是否可见（非受控默认值） */
  defaultPasswordVisible?: boolean;

  /** 左侧内容（图标、标签等） */
  leading?: ReactNode;

  /** 清除回调，清空动作本身由组件完成，此处只做额外通知 */
  onClear?: () => void;

  /** 密码可见性变化回调 */
  onPasswordVisibleChange?: (visible: boolean) => void;

  /** 密码是否可见（受控） */
  passwordVisible?: boolean;

  /**
   * 底层输入组件的 ref。
   *
   * Input 自己也要用它在清除后回焦，所以内外两个 ref 用 useComposedRefs 合成； 拿到后可以调 focus / blur / clear / measure 等 TextInput 原生方法。
   */
  ref?: Ref<TextInput>;

  /** 右侧内容（图标、按钮等），与 password 的眼睛图标可共存，排在其后 */
  trailing?: ReactNode;

  /** 输入框类型，password 时自动显示密码切换图标 */
  type?: InputType;
}
