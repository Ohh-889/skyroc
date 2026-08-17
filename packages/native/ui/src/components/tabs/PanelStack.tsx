import { cn } from '@skyroc/utils';
import { View } from 'react-native';
import { tabsVariants } from './tabs-variants';
import type { PanelStackProps } from './types';

/**
 * 面板容器：所有面板同时挂载，靠 `display` 切换显隐，仅激活项为 `flex`。
 *
 * 用于 web 回退实现，以及原生关闭 `swipeable` 时的场景。
 */
const PanelStack = (props: PanelStackProps) => {
  const { activeIndex, classNames, items, renderPanel } = props;

  const variantSlots = tabsVariants();

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      content: cn(variantSlots.content(), classNames?.content),
      pager: cn(variantSlots.pager(), classNames?.pager)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  return (
    <View className={slotClassNames.pager}>
      {items.map((item, index) => (
        <View
          key={item.key}
          className={slotClassNames.content}
          style={{ display: index === activeIndex ? 'flex' : 'none' }}
        >
          {renderPanel(index, item.children)}
        </View>
      ))}
    </View>
  );
};

export { PanelStack };
