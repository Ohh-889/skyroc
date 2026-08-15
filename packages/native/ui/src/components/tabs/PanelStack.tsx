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

  const slots = tabsVariants();

  return (
    <View className={cn(slots.pager(), classNames?.pager)}>
      {items.map((item, index) => (
        <View
          key={item.key}
          className={cn(slots.content(), classNames?.content)}
          style={{ display: index === activeIndex ? 'flex' : 'none' }}
        >
          {renderPanel(index, item.children)}
        </View>
      ))}
    </View>
  );
};

export { PanelStack };
