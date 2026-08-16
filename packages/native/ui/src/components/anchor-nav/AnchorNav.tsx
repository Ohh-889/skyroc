import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import * as Haptics from 'expo-haptics';
import { useImperativeHandle, useRef } from 'react';
import { Pressable, SectionList, StyleSheet, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent, SectionListData } from 'react-native';
import { Divider } from '../divider/Divider';
import { Sidebar } from '../sidebar/Sidebar';
import { Text } from '../text/Typography';
import { anchorNavVariants } from './anchor-nav-variants';
import type { AnchorNavChild, AnchorNavProps, AnchorNavSection } from './types';

/** SectionList 要求分组把子项挂在 data 上 */
type AnchorNavSectionData = AnchorNavSection & { data: AnchorNavChild[] };

/** 列表渲染回调里拿到的分组 */
type AnchorNavSectionInfo = SectionListData<AnchorNavChild, AnchorNavSectionData>;

/**
 * 分隔线的实际占位高度。
 *
 * 分隔线用的是 Divider 的默认 hairline（0.5 / 0.33dp），不是 1dp。这个值会随分组数累加进滚动偏移， 写死 1 会让定位随分组数线性漂移，所以直接取运行时实测值。
 */
const SEPARATOR_HEIGHT = StyleSheet.hairlineWidth;

/** 滚动位置落在边界上时的容差，避免浮点偏移让高亮在两组之间来回抖 */
const SECTION_HIT_TOLERANCE = 1;

/** 将 items 转为 SectionList sections */
function toSections(items: AnchorNavSection[]): AnchorNavSectionData[] {
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
    key: item.key ?? String(index),
    title: item.title
  }));
}

/**
 * 每个分组头在列表中的纵向起点，索引与 items 对齐。
 *
 * 点击侧栏的定位和滚动联动的反查共用这一张表：高度模型只有一份，改渲染时不会漏改另一处。 成立的前提是子项与分组头的实际高度等于传入的两个值——组件在渲染时把它们强制套在了外层节点上。
 */
function measureSectionOffsets(items: AnchorNavSection[], itemHeight: number, sectionHeaderHeight: number) {
  const offsets: number[] = [];

  let offset = 0;

  for (const item of items) {
    offsets.push(offset);

    const count = item.children.length;

    // 分隔线只画在同组子项之间（VirtualizedSectionList 跳过每组最后一项），所以是 count - 1 条
    offset += sectionHeaderHeight + count * itemHeight + Math.max(0, count - 1) * SEPARATOR_HEIGHT;
  }

  return offsets;
}

/** 反查滚动位置落在哪一组：即此刻吸顶的那个分组头所属的组 */
function findSectionIndexAt(offsets: number[], scrollY: number) {
  let index = 0;

  for (let i = 0; i < offsets.length; i += 1) {
    if (offsets[i] > scrollY + SECTION_HIT_TOLERANCE) break;

    index = i;
  }

  return index;
}

const AnchorNav = (props: AnchorNavProps) => {
  const {
    activeIndex: activeIndexProp,
    className,
    classNames,
    defaultActiveIndex = 0,
    haptic = true,
    itemHeight = 64,
    items,
    onIndexChange,
    onPressItem,
    ref,
    renderItem,
    renderSidebar,
    sectionHeaderHeight = 32,
    sidebarClassNames,
    sticky = true,
    ...restProps
  } = props;

  const [activeIndex, setActiveIndex] = useControllableState({
    caller: 'anchor-nav',
    defaultProp: defaultActiveIndex,
    onChange: onIndexChange,
    prop: activeIndexProp
  });

  const listRef = useRef<SectionList<AnchorNavChild, AnchorNavSectionData>>(null);

  /** 点击侧栏触发的程序化滚动尚未落幕；期间不让滚动联动改写高亮，否则高亮会沿途逐格跳过去 */
  const isProgrammaticScroll = useRef(false);

  const variantSlots = anchorNavVariants();

  const sections = toSections(items);
  const sidebarItems = toSidebarItems(items);
  const sectionOffsets = measureSectionOffsets(items, itemHeight, sectionHeaderHeight);

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      content: cn(variantSlots.content(), classNames?.content),
      item: cn(variantSlots.item(), classNames?.item),
      itemText: cn(variantSlots.itemText(), classNames?.itemText),
      root: cn(variantSlots.root(), classNames?.root, className),
      sectionHeader: cn(variantSlots.sectionHeader(), classNames?.sectionHeader),
      sectionHeaderText: cn(variantSlots.sectionHeaderText(), classNames?.sectionHeaderText),
      separator: cn(variantSlots.separator(), classNames?.separator),
      sidebar: cn(variantSlots.sidebar(), classNames?.sidebar)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  /** 定位到指定分组；点击侧栏与 ref.scrollToSection 走同一条路径，行为不会分叉 */
  function scrollToSection(index: number) {
    if (index < 0 || index >= sectionOffsets.length) return;

    setActiveIndex(index);

    isProgrammaticScroll.current = true;

    listRef.current?.getScrollResponder()?.scrollTo({ animated: true, y: sectionOffsets[index] });
  }

  function handleSidebarPress(index: number) {
    scrollToSection(index);

    // 点击是一次明确的用户动作，每次都给反馈，不按「索引是否变化」去重
    if (haptic) Haptics.selectionAsync();
  }

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (isProgrammaticScroll.current) return;

    const index = findSectionIndexAt(sectionOffsets, event.nativeEvent.contentOffset.y);

    if (index !== activeIndex) setActiveIndex(index);
  }

  /** 用户上手拖动即视为接管，程序化滚动的抑制立刻解除 */
  function handleScrollBeginDrag() {
    isProgrammaticScroll.current = false;
  }

  /**
   * 程序化滚动落幕。
   *
   * 目标位置就是当前位置时 RN 不派发这个事件，抑制标记会一直挂着——此时高亮停在刚点的那一组本来就是 期望行为，下一次拖动会由 onScrollBeginDrag 解除，不需要靠定时器兜底。
   */
  function handleMomentumScrollEnd() {
    isProgrammaticScroll.current = false;
  }

  function renderSectionHeader(info: { section: AnchorNavSectionInfo }) {
    return (
      <View
        accessibilityRole="header"
        className={slotClassNames.sectionHeader}
        style={{ height: sectionHeaderHeight }}
      >
        <Text className={slotClassNames.sectionHeaderText}>{info.section.title}</Text>
      </View>
    );
  }

  function renderSectionItem(info: { item: AnchorNavChild; section: AnchorNavSectionInfo }) {
    // 自定义渲染同样被钉死在 itemHeight 上：高度一旦跑偏，滚动定位就整体失准
    if (renderItem) {
      return <View style={{ height: itemHeight }}>{renderItem(info.item, info.section)}</View>;
    }

    return (
      <Pressable
        accessibilityLabel={info.item.text}
        accessibilityRole="button"
        className={slotClassNames.item}
        style={{ height: itemHeight }}
        onPress={() => onPressItem?.(info.item)}
      >
        <Text className={slotClassNames.itemText}>{info.item.text}</Text>
      </Pressable>
    );
  }

  function renderSeparator() {
    return <Divider className={slotClassNames.separator} />;
  }

  useImperativeHandle(ref, () => ({ scrollToSection }));

  return (
    <View
      className={slotClassNames.root}
      {...restProps}
    >
      {!renderSidebar && (
        <Sidebar
          activeIndex={activeIndex}
          className={slotClassNames.sidebar}
          classNames={sidebarClassNames}
          items={sidebarItems}
          onIndexChange={handleSidebarPress}
        />
      )}

      <SectionList
        ref={listRef}
        className={slotClassNames.content}
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={item => item.key}
        renderItem={renderSectionItem}
        renderSectionHeader={renderSectionHeader}
        scrollEventThrottle={16}
        sections={sections}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={sticky}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
      />

      {/* 排在列表之后：自定义侧栏多是悬浮在列表上的，靠绘制顺序压住，不指望 Android 的 zIndex */}
      {renderSidebar?.({ activeIndex, items, onPressIndex: handleSidebarPress })}
    </View>
  );
};

export { AnchorNav };
