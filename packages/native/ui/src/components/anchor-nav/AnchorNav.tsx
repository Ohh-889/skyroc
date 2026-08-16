import { useRef } from 'react';
import { Pressable, SectionList, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import type { SectionListData, ViewToken } from 'react-native';
import { Divider } from '../divider/Divider';
import { Sidebar } from '../sidebar/Sidebar';
import { Text } from '../text/Typography';
import { anchorNavVariants } from './anchor-nav-variants';
import type { AnchorNavChild, AnchorNavProps, AnchorNavSection } from './types';

/** SectionList 需要的数据格式 */
type SectionData = SectionListData<AnchorNavChild, AnchorNavSection & { data: AnchorNavChild[] }>;

/** 将 items 转为 SectionList sections */
function toSections(items: AnchorNavSection[]): SectionData[] {
  return items.map(item => ({
    ...item,
    data: item.children
  }));
}

/** 将 items 转为 Sidebar 所需的数据格式 */
function toSidebarItems(items: AnchorNavSection[]) {
  return items.map((item, index) => ({
    badge: item.badge,
    disabled: item.disabled,
    dot: item.dot,
    key: String(index),
    title: item.title
  }));
}

const AnchorNav = (props: AnchorNavProps) => {
  const {
    activeIndex: activeIndexProp,
    className,
    classNames,
    defaultActiveIndex = 0,
    height,
    itemHeight = 64,
    items,
    onIndexChange,
    onPressItem,
    renderItem: renderItemProp,
    sectionHeaderHeight = 32,
    sticky = true
  } = props;

  const [activeIndex, setActiveIndex] = useControllableState({
    caller: 'anchor-nav',
    defaultProp: defaultActiveIndex,
    onChange: onIndexChange,
    prop: activeIndexProp
  });

  const listRef = useRef<SectionList<AnchorNavChild, AnchorNavSection & { data: AnchorNavChild[] }>>(null);
  const isScrollingByTap = useRef(false);
  const lastHapticIndex = useRef(-1);

  const slots = anchorNavVariants();
  const sections = toSections(items);
  const sidebarItems = toSidebarItems(items);

  function handleViewableItemsChanged(info: { viewableItems: ViewToken<AnchorNavChild>[] }) {
    if (isScrollingByTap.current) return;

    const firstSection = info.viewableItems.find(token => token.section)?.section;
    if (!firstSection) return;

    const sectionIndex = items.findIndex(item => item.title === firstSection.title);
    if (sectionIndex >= 0 && sectionIndex !== activeIndex) {
      setActiveIndex(sectionIndex);
    }
  }

  function handleSidebarPress(index: number) {
    setActiveIndex(index);

    // 计算 offset
    const separatorHeight = 1;
    let offset = 0;
    for (let i = 0; i < index; i += 1) {
      const dataLen = items[i].children.length;
      offset += sectionHeaderHeight + dataLen * itemHeight + Math.max(0, dataLen - 1) * separatorHeight;
    }

    isScrollingByTap.current = true;
    listRef.current?.getScrollResponder()?.scrollTo({ y: offset, animated: true });

    // 动画结束后恢复滚动联动
    setTimeout(() => {
      isScrollingByTap.current = false;
    }, 300);

    if (lastHapticIndex.current !== index) {
      lastHapticIndex.current = index;
      Haptics.selectionAsync();
    }
  }

  function renderSectionHeader(info: { section: AnchorNavSection & { data: AnchorNavChild[] } }) {
    return (
      <View style={{ height: sectionHeaderHeight }}>
        <View className={cn(slots.sectionHeader(), classNames?.sectionHeader)}>
          <Text className={cn(slots.sectionHeaderText(), classNames?.sectionHeaderText)}>{info.section.title}</Text>
        </View>
      </View>
    );
  }

  function renderDefaultItem(info: { item: AnchorNavChild }) {
    if (renderItemProp) {
      return <View style={{ height: itemHeight }}>{renderItemProp(info.item)}</View>;
    }

    return (
      <Pressable
        style={{ height: itemHeight }}
        className={cn(slots.item(), classNames?.item)}
        onPress={() => onPressItem?.(info.item)}
      >
        <Text className={cn(slots.itemText(), classNames?.itemText)}>{info.item.text}</Text>
      </Pressable>
    );
  }

  function renderSeparator() {
    return <Divider className={cn(slots.separator(), classNames?.separator)} />;
  }

  return (
    <View style={height ? { height } : { flex: 1 }}>
      <View className={cn(slots.root(), className)}>
        <Sidebar
          activeIndex={activeIndex}
          items={sidebarItems}
          onIndexChange={handleSidebarPress}
        />

        <SectionList
          ref={listRef}
          className={cn(slots.content(), classNames?.content)}
          ItemSeparatorComponent={renderSeparator}
          keyExtractor={item => item.key}
          onViewableItemsChanged={handleViewableItemsChanged}
          renderItem={renderDefaultItem}
          renderSectionHeader={renderSectionHeader}
          sections={sections}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={sticky}
        />
      </View>
    </View>
  );
};

export { AnchorNav };
