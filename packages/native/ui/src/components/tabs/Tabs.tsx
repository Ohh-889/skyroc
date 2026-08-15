import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { ActivityIndicator, View } from 'react-native';
import { Pager } from './Pager';
import { TabBar } from './TabBar';
import { tabsVariants } from './tabs-variants';
import type { TabsProps } from './types';

const DefaultLazyPlaceholder = () => (
  <View className="flex-1 items-center justify-center">
    <ActivityIndicator className="text-muted-foreground" />
  </View>
);

const Tabs = (props: TabsProps) => {
  const {
    activeIndex: activeIndexProp,
    className,
    classNames,
    defaultActiveIndex = 0,
    items,
    lazy = false,
    lazyPreloadDistance = 0,
    onIndexChange,
    renderLazyPlaceholder = () => <DefaultLazyPlaceholder />,
    swipeable = true,
    type = 'line'
  } = props;

  const [activeIndex, setActiveIndex] = useControllableState({
    caller: 'tabs',
    defaultProp: defaultActiveIndex,
    onChange: onIndexChange,
    prop: activeIndexProp
  });

  const variantSlots = tabsVariants({ type });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      root: cn(variantSlots.root(), className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  return (
    <View className={slotClassNames.root}>
      <TabBar
        activeIndex={activeIndex}
        classNames={classNames}
        items={items}
        onTabPress={setActiveIndex}
        type={type}
      />
      <Pager
        activeIndex={activeIndex}
        classNames={classNames}
        items={items}
        lazy={lazy}
        lazyPreloadDistance={lazyPreloadDistance}
        onPageChange={setActiveIndex}
        renderLazyPlaceholder={renderLazyPlaceholder}
        swipeable={swipeable}
      />
    </View>
  );
};

export { Tabs };
