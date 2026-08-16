import type { ComponentType, Ref } from 'react';
import type { CodeFieldProps } from 'react-native-confirmation-code-field';
import type { TextInputProps } from 'react-native';
import type { SlotClassNames } from '../../types/shared';
import type { PasswordInputSlots, PasswordInputVariantProps } from './password-input-variants';

/** 密码输入框实例暴露的方法 */
interface PasswordInputRef {
  /** 失焦并隐藏键盘 */
  blur: () => void;

  /** 聚焦并弹出键盘 */
  focus: () => void;
}

/** 密码输入框组件属性，继承 TextInputProps 以支持透传底层属性 */
interface PasswordInputProps
  extends
    Omit<CodeFieldProps, 'defaultValue' | 'onChangeText' | 'ref' | 'style' | 'value' | 'onChange' | 'renderCell'>,
    PasswordInputVariantProps {
  /** NativeWind 类名 */
  className?: string;

  InputComponent?: ComponentType<TextInputProps>;
  /** 覆盖各插槽的 className */
  classNames?: SlotClassNames<PasswordInputSlots>;

  /** 默认值（非受控模式） */
  defaultValue?: string;

  /** 输入框下方错误提示（优先于 info 显示） */
  errorInfo?: string;

  /** 格子间距（像素），为 0 时格子紧贴并用边框分隔 */
  gutter?: number;

  /** 输入框下方提示信息 */
  info?: string;

  /** 密码最大长度（格子数量） */
  length?: number;

  /** 是否隐藏密码内容（显示圆点代替字符） */
  mask?: boolean;

  /** 值变化回调 */
  onChange?: (value: string) => void;

  /** 输入完成（长度达到 length）时触发 */
  onComplete?: (value: string) => void;

  /** 组件实例引用，用于调用 focus/blur 方法 */
  ref?: Ref<PasswordInputRef>;

  /** 当前输入值（受控模式） */
  value?: string;
}

export type { PasswordInputProps, PasswordInputRef };
