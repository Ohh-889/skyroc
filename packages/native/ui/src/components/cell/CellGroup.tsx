import { Children, cloneElement, isValidElement } from 'react';
import { View } from 'react-native';
import { cn } from '@skyroc/utils';
import { Text } from '../text/Typography';
import { cellGroupVariants } from './cell-variants';
import type { CellGroupProps } from './types';

const CellGroup = (props: CellGroupProps) => {
  const { border = true, children, className, inset = false, title, titleClassName } = props;

  const { root: rootCls, title: groupTitleCls } = cellGroupVariants({ inset });

  function renderChildren() {
    if (!border) return children;

    const childArray = Children.toArray(children).filter(isValidElement);

    return childArray.map((child, index) => {
      const isLast = index === childArray.length - 1;
      if (isLast) return child;

      return cloneElement(child as React.ReactElement<{ classNames?: Record<string, string> }>, {
        classNames: {
          ...(child.props as { classNames?: Record<string, string> }).classNames,
          root: cn('border-b border-border', (child.props as { classNames?: Record<string, string> }).classNames?.root)
        }
      });
    });
  }

  return (
    <View>
      {title ? <Text className={cn(groupTitleCls(), titleClassName)}>{title}</Text> : null}
      <View className={cn(rootCls(), className)}>{renderChildren()}</View>
    </View>
  );
};

export { CellGroup };
