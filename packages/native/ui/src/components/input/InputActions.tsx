import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable } from 'react-native';
import { withUniwind } from 'uniwind';

/** Ionicons 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，让功能图标跟随主题 token */
const ActionIcon = withUniwind(Ionicons);

interface ActionButtonProps {
  /** 容器 className */
  className: string;

  /** 图标取色用的 `accent-*` 工具类 */
  colorClassName: string;

  /** 禁用时不响应点击，避免 disabled 态仍能清空或切换密码可见性 */
  disabled: boolean;

  /** 图标像素尺寸，随 Input 尺寸变化 */
  iconSize: number;

  /** Ionicons 图标名 */
  name: ComponentProps<typeof Ionicons>['name'];

  /** 点击回调 */
  onPress: () => void;

  testID?: string;
}

/** 尾部功能按钮，统一命中区与取色方式 */
const ActionButton = (props: ActionButtonProps) => {
  const { className, colorClassName, disabled, iconSize, name, onPress, testID } = props;

  return (
    <Pressable
      className={className}
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
      testID={testID}
    >
      <ActionIcon
        colorClassName={colorClassName}
        name={name}
        size={iconSize}
      />
    </Pressable>
  );
};

interface InputActionsProps {
  /** 按钮容器 className */
  className: string;

  /** 图标取色用的 `accent-*` 工具类 */
  colorClassName: string;

  /** 是否禁用 */
  disabled: boolean;

  /** 图标像素尺寸 */
  iconSize: number;

  /** 是否渲染密码可见性切换按钮 */
  isPassword: boolean;

  /** 清除回调，传入即渲染清除按钮；不需要清除时传 undefined */
  onClear?: () => void;

  /** 密码可见性切换回调 */
  onTogglePasswordVisible: () => void;

  /** 密码当前是否可见 */
  passwordVisible: boolean;

  /** Input 的 testID，按钮在其后追加 `-clear` / `-eye` 后缀 */
  testID?: string;
}

/** Input 尾部的功能按钮组，清除与密码切换可共存，且都排在调用方的 trailing 之前 */
const InputActions = (props: InputActionsProps) => {
  const {
    className,
    colorClassName,
    disabled,
    iconSize,
    isPassword,
    onClear,
    onTogglePasswordVisible,
    passwordVisible,
    testID
  } = props;

  return (
    <>
      {onClear ? (
        <ActionButton
          className={className}
          colorClassName={colorClassName}
          disabled={disabled}
          iconSize={iconSize}
          name="close-circle"
          onPress={onClear}
          testID={testID && `${testID}-clear`}
        />
      ) : null}

      {isPassword ? (
        <ActionButton
          className={className}
          colorClassName={colorClassName}
          disabled={disabled}
          iconSize={iconSize}
          name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
          onPress={onTogglePasswordVisible}
          testID={testID && `${testID}-eye`}
        />
      ) : null}
    </>
  );
};

export { InputActions };
