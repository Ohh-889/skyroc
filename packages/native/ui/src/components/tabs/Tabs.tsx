import { ActivityIndicator, View } from 'react-native';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { TabBar } from './TabBar';
import { Pager } from './Pager';
import { tabsVariants } from './tabs-variants';
import type { TabsProps } from './types';

function DefaultLazyPlaceholder() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator className="text-muted-foreground" />
    </View>
  );
}

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

  const slots = tabsVariants({ type });

  return (
    <View className={cn(slots.root(), className)}>
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
