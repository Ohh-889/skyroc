import { Children, Fragment, isValidElement } from 'react';
import { View } from 'react-native';
import { cn, isNumber } from '@skyroc/utils';
import { spaceVariants } from './space-variants';
import type { SpaceProps } from './types';

/** 间距组件 */
const Space = (props: SpaceProps) => {
  const {
    align,
    children,
    className,
    direction = 'horizontal',
    fill,
    size = 'md',
    split,
    style,
    wrap,
    ...rest
  } = props;

  // 数值间距无法映射成 gap-* 类名，改由内联 style 承担
  const customGap = isNumber(size) ? size : undefined;

  const variantClass = spaceVariants({
    align,
    direction,
    fill,
    size: isNumber(size) ? undefined : size,
    wrap
  });

  // 在子元素之间插入分隔符；Children.toArray 会剔除 null/undefined 并补全 key
  function renderChildren() {
    if (!split) {
      return children;
    }

    return Children.toArray(children).map((child, index) => (
      <Fragment key={isValidElement(child) ? (child.key ?? index) : index}>
        {index > 0 ? split : null}
        {child}
      </Fragment>
    ));
  }

  return (
    <View
      className={cn(variantClass, className)}
      style={customGap === undefined ? style : [{ gap: customGap }, style]}
      {...rest}
    >
      {renderChildren()}
    </View>
  );
};

export { Space };
