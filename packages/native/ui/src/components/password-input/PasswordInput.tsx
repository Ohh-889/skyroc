import { useImperativeHandle } from 'react';
import { TextInput, View } from 'react-native';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { CodeField, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import type { RenderCellOptions } from 'react-native-confirmation-code-field';
import { Text } from '../text/Typography';
import { passwordInputVariants } from './password-input-variants';
import { PasswordInputCell } from './PasswordInputCell';
import type { PasswordInputProps } from './types';

/**
 * 底层 TextInput 的默认值：数字键盘对应 6 位数字密码的主流场景，锁死字体缩放是为了让格子高度
 * 不被系统字号撑破。这些默认值展开在 rest 之前，字母密码等场景可以由调用方逐项覆盖。
 */
const CODE_FIELD_DEFAULTS = {
  allowFontScaling: false,
  autoCapitalize: 'none',
  keyboardType: 'number-pad',
  maxFontSizeMultiplier: 1
} as const;

const PasswordInput = (props: PasswordInputProps) => {
  const {
    className,
    classNames,
    component: InputComponent = TextInput,
    defaultValue = '',
    errorInfo,
    gutter = 12,
    info,
    length = 6,
    mask = true,
    onChangeText,
    onComplete,
    ref,
    size,
    value: valueProp,
    variant = 'merged',
    ...rest
  } = props;

  // 值交给组件托管，受控与非受控共用一条路径，onComplete 在两种用法下才都能按同一时机触发
  const [value = '', setValue] = useControllableState({
    caller: 'PasswordInput',
    defaultProp: defaultValue,
    onChange: onChangeText,
    prop: valueProp
  });

  const inputRef = useBlurOnFulfill({ cellCount: length, value });
  const [clearByFocusCellProps, getCellOnLayoutHandler] = useClearByFocusCell({ setValue, value });

  const isSeparated = variant === 'separated';
  const slots = passwordInputVariants({ size, status: errorInfo ? 'error' : 'default', variant });

  // CodeField 替换输入组件的那条重载不接受 ref，只能绕开重载用展开透传
  const inputComponentProps = { InputComponent };

  function handleChangeText(text: string) {
    setValue(text);

    if (text.length === length) {
      onComplete?.(text);
    }
  }

  /** 格子边框色优先级：错误 > 聚焦 > 默认 */
  function resolveCellStatus(isFocused: boolean) {
    if (errorInfo) {
      return 'error' as const;
    }

    return isFocused ? ('focused' as const) : ('default' as const);
  }

  function renderCell(options: RenderCellOptions) {
    const { index, isFocused, symbol } = options;

    return (
      <PasswordInputCell
        key={index}
        className={cn(
          slots.cell({ divider: !isSeparated && index > 0, status: resolveCellStatus(isFocused) }),
          classNames?.cell
        )}
        dotClassName={cn(slots.dot(), classNames?.dot)}
        isFocused={isFocused}
        mask={mask}
        symbol={symbol}
        symbolClassName={cn(slots.symbol(), classNames?.symbol)}
        onLayout={getCellOnLayoutHandler(index)}
      />
    );
  }

  useImperativeHandle(ref, () => ({
    blur() {
      inputRef.current?.blur();
    },
    focus() {
      inputRef.current?.focus();
    }
  }));

  return (
    <View className={cn(slots.root(), className, classNames?.root)}>
      <View className={cn(slots.security(), classNames?.security)}>
        {/* 展开顺序固定为三层：默认值 → 调用方的 rest → 组件托管的值与 useClearByFocusCell 的行为（不可被覆盖） */}
        <CodeField
          {...CODE_FIELD_DEFAULTS}
          {...rest}
          {...clearByFocusCellProps}
          {...inputComponentProps}
          ref={inputRef}
          cellCount={length}
          rootStyle={isSeparated && gutter > 0 ? { gap: gutter } : undefined}
          value={value}
          onChangeText={handleChangeText}
          renderCell={renderCell}
        />
      </View>

      {info && !errorInfo ? <Text className={cn(slots.info(), classNames?.info)}>{info}</Text> : null}
      {errorInfo ? <Text className={cn(slots.errorInfo(), classNames?.errorInfo)}>{errorInfo}</Text> : null}
    </View>
  );
};

export { PasswordInput };
