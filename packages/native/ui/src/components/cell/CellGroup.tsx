import { cn, isString } from '@skyroc/utils';
import { Children, isValidElement } from 'react';
import { View } from 'react-native';
import { Text } from '../text/Typography';
import { cellGroupVariants } from './cell-variants';
import type { CellGroupProps } from './types';

/**
 * Cell 分组容器。
 *
 * 分隔线由容器自己插入独立元素，而不是往子元素上注入类名： 子元素可以是 Cell 之外的任何组件（业务包装、Link asChild 等）， 注入类名的做法一旦碰上不认 classNames 的子元素就会静默失效。
 */
const CellGroup = (props: CellGroupProps) => {
  const { border = true, children, classNames, inset = false, title } = props;

  const variantSlots = cellGroupVariants({ inset });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      divider: cn(variantSlots.divider(), classNames?.divider),
      root: cn(variantSlots.root(), classNames?.root),
      title: cn(variantSlots.title(), classNames?.title)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function renderChildren() {
    if (!border) return children;

    const items = Children.toArray(children).filter(isValidElement);

    return items.flatMap((child, index) =>
      index === items.length - 1
        ? [child]
        : [
            child,
            <View
              className={slotClassNames.divider}
              key={`${child.key}-divider`}
            />
          ]
    );
  }

  return (
    <View>
      {isString(title) ? <Text className={slotClassNames.title}>{title}</Text> : title}
      <View className={slotClassNames.root}>{renderChildren()}</View>
    </View>
  );
};

export { CellGroup };
