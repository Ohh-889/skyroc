import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { INPUT_ICON_SIZE_MAP, inputVariants } from './input-variants';
import { InputActions } from './InputActions';
import type { InputProps } from './types';

const Input = (props: InputProps) => {
  const {
    className,
    classNames,
    clearable = false,
    component: InputComponent = TextInput,
    defaultPasswordVisible = false,
    defaultValue,
    disabled = false,
    error,
    leading,
    onBlur,
    onChangeText,
    onClear,
    onFocus,
    onPasswordVisibleChange,
    passwordVisible: passwordVisibleProp,
    ref,
    size = 'md',
    trailing,
    type = 'text',
    value: valueProp,
    variant = 'outline',
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<TextInput>(null);

  // Input 内部要用 inputRef 在清除后把焦点还给输入框，同时把实例抛给调用方，两个 ref 合成一个
  const composedRefs = useComposedRefs(inputRef, ref);

  // 值交给组件托管，受控与非受控共用一条路径，清除按钮才能在两种用法下都真正清空
  const [value, setValue] = useControllableState({
    caller: 'Input',
    defaultProp: defaultValue ?? '',
    onChange: onChangeText,
    prop: valueProp
  });

  const [passwordVisible, setPasswordVisible] = useControllableState({
    caller: 'Input',
    defaultProp: defaultPasswordVisible,
    onChange: onPasswordVisibleChange,
    prop: passwordVisibleProp
  });

  const isPassword = type === 'password';
  const showClear = clearable && !disabled && Boolean(value);
  const iconSize = INPUT_ICON_SIZE_MAP[size];

  const variantSlots = inputVariants({ disabled, error, focused: isFocused, size, variant });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      action: cn(variantSlots.action(), classNames?.action),
      actionIcon: variantSlots.actionIcon(),
      control: cn(variantSlots.control(), classNames?.control),
      root: cn(variantSlots.root(), className, classNames?.root)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function handleFocus(e: Parameters<NonNullable<InputProps['onFocus']>>[0]) {
    setIsFocused(true);
    onFocus?.(e);
  }

  function handleBlur(e: Parameters<NonNullable<InputProps['onBlur']>>[0]) {
    setIsFocused(false);
    onBlur?.(e);
  }

  function handleClear() {
    setValue('');
    // 清除按钮会抢走焦点，键盘随之收起；把焦点还回输入框，用户可以接着输入
    inputRef.current?.focus();
    onClear?.();
  }

  function handleTogglePasswordVisible() {
    setPasswordVisible(!passwordVisible);
  }

  return (
    <View className={slotClassNames.root}>
      {leading}

      {/* rest 展开在最前，避免调用方的透传属性覆盖下面这些由组件托管的受控属性 */}
      <InputComponent
        {...rest}
        ref={composedRefs}
        allowFontScaling={false}
        className={slotClassNames.control}
        editable={!disabled}
        maxFontSizeMultiplier={1}
        onBlur={handleBlur}
        onChangeText={setValue}
        onFocus={handleFocus}
        secureTextEntry={isPassword && !passwordVisible}
        value={value}
      />

      <InputActions
        className={slotClassNames.action}
        colorClassName={slotClassNames.actionIcon}
        disabled={disabled}
        iconSize={iconSize}
        isPassword={isPassword}
        onClear={showClear ? handleClear : undefined}
        onTogglePasswordVisible={handleTogglePasswordVisible}
        passwordVisible={passwordVisible}
        testID={rest.testID}
      />

      {trailing}
    </View>
  );
};

export { Input };
