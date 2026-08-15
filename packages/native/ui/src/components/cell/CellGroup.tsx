import { cn, isString } from '@skyroc/utils';
import { Children, isValidElement } from 'react';
import { View } from 'react-native';
import { Text } from '../text/Typography';
import { cellGroupVariants } from './cell-variants';
import type { CellGroupProps } from './types';

/**
 * Cell 分组容器。
 *
 * 分隔线由容器自己插入独立元素，而不是往子元素上注入类名： 子元素可以是 Cell 之外的任何组件（业务包装、Link asChild 等），
 * 注入类名的做法一旦碰上不认 classNames 的子元素就会静默失效。
 */
const CellGroup = (props: CellGroupProps) => {
  const { border = true, children, classNames, inset = false, title } = props;

  const { divider: dividerCls, root: rootCls, title: groupTitleCls } = cellGroupVariants({ inset });

  function renderChildren() {
    if (!border) return children;

    const items = Children.toArray(children).filter(isValidElement);

    return items.flatMap((child, index) =>
      index === items.length - 1
        ? [child]
        : [
            child,
            <View
              className={cn(dividerCls(), classNames?.divider)}
              key={`${child.key}-divider`}
            />
          ]
    );
  }

  return (
    <View>
      {isString(title) ? <Text className={cn(groupTitleCls(), classNames?.title)}>{title}</Text> : title}
      <View className={cn(rootCls(), classNames?.root)}>{renderChildren()}</View>
    </View>
  );
};

export { CellGroup };
