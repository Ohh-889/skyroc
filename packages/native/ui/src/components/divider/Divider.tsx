import { View } from 'react-native';
import { cn, isString } from '@skyroc/utils';
import { Text } from '../text/Typography';
import { dividerVariants } from './divider-variants';
import type { DividerProps } from './types';

/** 分割线组件 */
const Divider = (props: DividerProps) => {
  const {
    children,
    className,
    contentPosition = 'center',
    dashed = false,
    hairline = true,
    lineClassName,
    orientation = 'horizontal',
    textClassName,
    ...rest
  } = props;

  const slots = dividerVariants({ orientation, dashed, hairline, contentPosition });
  const isHorizontal = orientation === 'horizontal';
  const hasContent = isHorizontal && children !== undefined && children !== null;

  // 带内容的水平分割线：左线 — 文字 — 右线
  if (hasContent) {
    const isLeft = contentPosition === 'left';
    const isRight = contentPosition === 'right';

    return (
      <View
        className={cn(slots.root(), className)}
        role="separator"
      >
        <View
          className={cn(slots.line(), isLeft && 'max-w-[10%]', lineClassName)}
          {...rest}
        />
        {isString(children) ? <Text className={cn(slots.text(), textClassName)}>{children}</Text> : children}
        <View
          className={cn(slots.line(), isRight && 'max-w-[10%]', lineClassName)}
          {...rest}
        />
      </View>
    );
  }

  // 无内容：单条线
  return (
    <View
      className={cn(slots.root(), className)}
      role="separator"
    >
      <View
        className={cn(slots.line(), lineClassName)}
        {...rest}
      />
    </View>
  );
};

export { Divider };
