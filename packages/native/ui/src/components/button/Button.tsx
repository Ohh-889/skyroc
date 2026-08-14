/* eslint-disable complexity */
import { ActivityIndicator, Pressable } from 'react-native';
import { cn, isString } from '@skyroc/utils';
import { Text, TextClassContext } from '../text/Typography';
import { buttonTextVariants, buttonVariants } from './button-variants';
import type { ButtonProps } from './types';

const Button = (props: ButtonProps) => {
  const {
    block = false,
    children,
    className,
    color = 'primary',
    disabled = false,
    leading,
    loading = false,
    shape = 'rounded',
    size = 'md',
    textClassName,
    trailing,
    variant = 'solid',
    ...rest
  } = props;

  const isDisabled = disabled || loading;

  const textClass = cn(buttonTextVariants({ variant, color, size }), textClassName);

  const slots = buttonVariants({ variant, color, size, shape, block });

  return (
    <TextClassContext.Provider value={textClass}>
      <Pressable
        className={cn(slots, isDisabled && 'opacity-50', className)}
        disabled={isDisabled}
        role="button"
        {...rest}
      >
        {loading && (
          <ActivityIndicator
            className={cn(textClass)}
            size="small"
          />
        )}
        {leading}
        {isString(children) ? <Text className={textClass}>{children}</Text> : children}
        {trailing}
      </Pressable>
    </TextClassContext.Provider>
  );
};

export { Button };
