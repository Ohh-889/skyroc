import { useRef, useState } from 'react';
import { SectionList, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { cn } from '@skyroc/utils';
import type { ViewToken } from 'react-native';
import { Button } from '../button/Button';
import { Divider } from '../divider/Divider';
import { Text } from '../text/Typography';
import { indexBarVariants } from './index-bar-variants';
import type { IndexBarChild, IndexBarItem, IndexBarProps } from './types';

const IndexBar = (props: IndexBarProps) => {
  const {
    className,
    classNames,
    indexList,
    itemHeight = 40,
    items,
    onIndexChange,
    onPressItem,
    onSelect,
    renderItem: renderItemProp,
    sectionHeaderHeight = 32,
    sticky = true
  } = props;

  const listRef = useRef<SectionList<IndexBarChild, IndexBarItem>>(null);
  const [activeIndex, setActiveIndex] = useState(items[0]?.title ?? '');
  const lastHapticIndex = useRef('');

  const slots = indexBarVariants();
  const indices = indexList ?? items.map(item => item.title);

  function updateActiveIndex(index: string) {
    setActiveIndex(index);
    onIndexChange?.(index);
  }

  function handleViewableItemsChanged(info: { viewableItems: ViewToken<IndexBarChild>[] }) {
    const firstSection = info.viewableItems.find(token => token.section)?.section as IndexBarItem | undefined;

    if (!firstSection) return;

    updateActiveIndex(firstSection.title);
  }

  function scrollToIndex(index: string) {
    const sectionIndex = items.findIndex(item => item.title === index);
    if (sectionIndex < 0) return;

    // 累加目标 section 之前所有 section 的 header + items + separators 高度
    const separatorHeight = 1;
    let offset = 0;
    for (let i = 0; i < sectionIndex; i += 1) {
      const dataLen = items[i].data.length;
      offset += sectionHeaderHeight + dataLen * itemHeight + Math.max(0, dataLen - 1) * separatorHeight;
    }

    listRef.current?.getScrollResponder()?.scrollTo({ y: offset, animated: true });
    onSelect?.(index);

    if (lastHapticIndex.current !== index) {
      lastHapticIndex.current = index;
      Haptics.selectionAsync();
    }
  }

  function renderSectionHeader(info: { section: IndexBarItem }) {
    return (
      <View style={{ height: sectionHeaderHeight }}>
        <View className={cn(slots.anchor(), classNames?.anchor)}>
          <Text className={cn(slots.anchorText(), classNames?.anchorText)}>{info.section.title}</Text>
        </View>
      </View>
    );
  }

  function renderDefaultItem(info: { item: IndexBarChild }) {
    if (renderItemProp) {
      return <>{renderItemProp(info.item)}</>;
    }

    return (
      <View style={{ height: itemHeight }}>
        <Button
          className={cn(slots.item(), classNames?.item)}
          textClassName={cn(slots.itemText(), classNames?.itemText)}
          variant="ghost"
          onPress={() => onPressItem?.(info.item)}
        >
          {info.item.text}
        </Button>
      </View>
    );
  }

  function renderSeparator() {
    return <Divider className={cn(slots.separator(), classNames?.separator)} />;
  }

  return (
    <View className={cn(slots.root(), className)}>
      <SectionList
        ref={listRef}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={item => item.key}
        onViewableItemsChanged={handleViewableItemsChanged}
        renderItem={renderDefaultItem}
        renderSectionHeader={renderSectionHeader}
        sections={items}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={sticky}
      />

      {/* Sidebar */}
      <View className={cn(slots.sidebar(), classNames?.sidebar)}>
        {indices.map(index => {
          const isActive = index === activeIndex;
          const itemSlots = indexBarVariants({ active: isActive });

          return (
            <Button
              key={index}
              hitSlop={3}
              className={cn(itemSlots.sidebarItem(), classNames?.sidebarItem)}
              color={isActive ? 'primary' : 'muted'}
              size="sm"
              textClassName={cn(itemSlots.sidebarItemText(), classNames?.sidebarItemText)}
              variant="ghost"
              onPress={() => scrollToIndex(index)}
            >
              {index}
            </Button>
          );
        })}
      </View>
    </View>
  );
};

export { IndexBar };
