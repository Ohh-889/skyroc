import { cn } from '@skyroc/utils';
import { ActivityIndicator, Pressable } from 'react-native';
import { Text, TextClassContext } from '../text/Typography';
import { DEFAULT_BUTTON_SIZE, buttonIndicatorVariants, buttonTextVariants, buttonVariants } from './button-variants';
import type { ButtonProps, ButtonSize } from './types';

/** 各尺寸补偿的触摸热区，保证实际可点区域不低于 44pt */
const HIT_SLOP: Record<ButtonSize, number> = {
  sm: 6,
  md: 2,
  lg: 0,
  icon: 2
};

const Button = (props: ButtonProps) => {
  const {
    block,
    children,
    className,
    color,
    disabled = false,
    leading,
    loading = false,
    shape,
    size,
    textClassName,
    trailing,
    variant,
    ...rest
  } = props;

  const isDisabled = disabled || loading;

  const isTextChild = typeof children === 'string' || typeof children === 'number';

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      indicator: buttonIndicatorVariants({ variant, color }),
      root: cn(buttonVariants({ variant, color, size, shape, block }), isDisabled && 'opacity-50', className),
      text: cn(buttonTextVariants({ variant, color, size }), textClassName)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  return (
    <TextClassContext.Provider value={slotClassNames.text}>
      <Pressable
        accessibilityState={{ busy: loading, disabled: isDisabled }}
        className={slotClassNames.root}
        disabled={isDisabled}
        hitSlop={HIT_SLOP[size ?? DEFAULT_BUTTON_SIZE]}
        role="button"
        {...rest}
      >
        {/* loading 时占用 leading 位，避免额外插入节点导致按钮宽度跳动 */}
        {loading ? (
          <ActivityIndicator
            colorClassName={slotClassNames.indicator}
            size="small"
          />
        ) : (
          leading
        )}
        {isTextChild ? <Text>{children}</Text> : children}
        {trailing}
      </Pressable>
    </TextClassContext.Provider>
  );
};

export { Button };
