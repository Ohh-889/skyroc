import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { TextInput, View } from 'react-native';
import type { TextStyle } from 'react-native';
import { CodeField, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import type { RenderCellOptions } from 'react-native-confirmation-code-field';
import { Text } from '../text/Typography';
import { passwordInputVariants } from './password-input-variants';
import { PasswordInputCell } from './PasswordInputCell';
import type { PasswordInputProps } from './types';

/** 底层 TextInput 的默认值：数字键盘对应 6 位数字密码的主流场景，锁死字体缩放是为了让格子高度 不被系统字号撑破。这些默认值展开在 rest 之前，字母密码等场景可以由调用方逐项覆盖。 */
const CODE_FIELD_DEFAULTS = {
  allowFontScaling: false,
  autoCapitalize: 'none',
  keyboardType: 'number-pad',
  maxFontSizeMultiplier: 1
} as const;

/**
 * 承接触摸的透明输入框：CodeField 自己那份定位来自它模块内的 `...StyleSheet.absoluteFill`， 在本仓库实测没有生效（输入框退回文档流、宽度塌成 0，导致整个组件点不动），这里用我们自己的
 * 对象把定位写死。CodeField 会把 textInputStyle 合并在它自身样式之后，所以这份能覆盖它。 opacity 与 fontSize 沿用库的取值：不能真正透明，否则收不到触摸；1px 字号让光标始终落在末尾。
 */
const CODE_FIELD_INPUT_STYLE: TextStyle = {
  bottom: 0,
  fontSize: 1,
  left: 0,
  opacity: 0.015,
  position: 'absolute',
  right: 0,
  top: 0
};

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

  // PasswordInput 内部要用 inputRef 做输满自动失焦，同时把实例抛给调用方，两个 ref 合成一个
  const composedRefs = useComposedRefs(inputRef, ref);

  const [clearByFocusCellProps, getCellOnLayoutHandler] = useClearByFocusCell({ setValue, value });

  const isSeparated = variant === 'separated';
  const variantSlots = passwordInputVariants({ size, status: errorInfo ? 'error' : 'default', variant });

  /**
   * 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用。
   *
   * Cell 槽依赖格子下标与聚焦态，只能在 renderCell 里逐格算，不参与这里。
   */
  function resolveSlotClassNames() {
    return {
      dot: cn(variantSlots.dot(), classNames?.dot),
      errorInfo: cn(variantSlots.errorInfo(), classNames?.errorInfo),
      info: cn(variantSlots.info(), classNames?.info),
      root: cn(variantSlots.root(), classNames?.root, className),
      security: cn(variantSlots.security(), classNames?.security),
      symbol: cn(variantSlots.symbol(), classNames?.symbol)
    };
  }

  const slotClassNames = resolveSlotClassNames();

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
          variantSlots.cell({ divider: !isSeparated && index > 0, status: resolveCellStatus(isFocused) }),
          classNames?.cell
        )}
        dotClassName={slotClassNames.dot}
        isFocused={isFocused}
        mask={mask}
        symbol={symbol}
        symbolClassName={slotClassNames.symbol}
        onLayout={getCellOnLayoutHandler(index)}
      />
    );
  }

  return (
    <View className={slotClassNames.root}>
      <View className={slotClassNames.security}>
        {/* 展开顺序固定为三层：默认值 → 调用方的 rest → 组件托管的值与 useClearByFocusCell 的行为（不可被覆盖） */}
        <CodeField
          {...CODE_FIELD_DEFAULTS}
          {...rest}
          {...clearByFocusCellProps}
          {...inputComponentProps}
          ref={composedRefs}
          cellCount={length}
          rootStyle={isSeparated && gutter > 0 ? { gap: gutter } : undefined}
          textInputStyle={CODE_FIELD_INPUT_STYLE}
          value={value}
          onChangeText={handleChangeText}
          renderCell={renderCell}
        />
      </View>

      {Boolean(info) && !errorInfo ? <Text className={slotClassNames.info}>{info}</Text> : null}
      {errorInfo ? <Text className={slotClassNames.errorInfo}>{errorInfo}</Text> : null}
    </View>
  );
};

export { PasswordInput };
