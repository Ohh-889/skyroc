import { cn } from '@skyroc/utils';
import { useImperativeHandle, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { AnchorNav } from '../anchor-nav/AnchorNav';
import type { AnchorNavRef, AnchorNavSidebarContext } from '../anchor-nav/types';
import { Text } from '../text/Typography';
import { indexBarVariants } from './index-bar-variants';
import type { IndexBarProps } from './types';

/** 索引项只有 20dp 宽，横向补到 44pt；纵向各项首尾相接，再补就会和相邻项抢同一块触区 */
const SIDEBAR_ITEM_HIT_SLOP = { left: 12, right: 12 };

/** 侧栏单个索引项属性 */
interface IndexBarSidebarItemProps {
  /** 是否为当前激活索引 */
  active: boolean;

  /** 各插槽自定义 className */
  classNames: IndexBarProps['classNames'];

  /** 索引字母 */
  index: string;

  /** 点击回调 */
  onPress: () => void;
}

const IndexBarSidebarItem = (props: IndexBarSidebarItemProps) => {
  const { active, classNames, index, onPress } = props;

  const variantSlots = indexBarVariants({ active });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      sidebarItem: cn(variantSlots.sidebarItem(), classNames?.sidebarItem),
      sidebarItemText: cn(variantSlots.sidebarItemText(), classNames?.sidebarItemText)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  return (
    <Pressable
      accessibilityLabel={index}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className={slotClassNames.sidebarItem}
      hitSlop={SIDEBAR_ITEM_HIT_SLOP}
      onPress={onPress}
    >
      <Text className={slotClassNames.sidebarItemText}>{index}</Text>
    </Pressable>
  );
};

/**
 * 索引栏：分组列表 + 右缘悬浮的字母索引条。
 *
 * 列表本体整套交给 AnchorNav——滚动定位的高度模型、点击侧栏时的程序化滚动抑制、触感策略都只在那边有一份， 这里只负责把「字母」这层身份换掉：AnchorNav 对外是下标，IndexBar 对外是
 * `title`，两者在边界上互转。
 */
const IndexBar = (props: IndexBarProps) => {
  const {
    className,
    classNames,
    haptic = true,
    itemHeight = 40,
    items,
    onIndexChange,
    onPressItem,
    ref,
    renderItem,
    sectionHeaderHeight = 32,
    sticky = true,
    ...restProps
  } = props;

  const anchorNavRef = useRef<AnchorNavRef>(null);

  const variantSlots = indexBarVariants();

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      content: cn(variantSlots.content(), classNames?.content),
      sidebar: cn(variantSlots.sidebar(), classNames?.sidebar)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  /** 列表本体的插槽原样往下传，由 AnchorNav 与它自己的变体合并；只有 content 要先叠上给索引条让位的右内边距 */
  function resolveAnchorNavClassNames() {
    return {
      content: slotClassNames.content,
      item: classNames?.item,
      itemText: classNames?.itemText,
      root: classNames?.root,
      sectionHeader: classNames?.sectionHeader,
      sectionHeaderText: classNames?.sectionHeaderText,
      separator: classNames?.separator
    };
  }

  const anchorNavClassNames = resolveAnchorNavClassNames();

  function handleIndexChange(index: number) {
    const section = items[index];

    if (!section) return;

    onIndexChange?.(section.title);
  }

  /** 对外的定位入口按字母查；查不到时 findIndex 给出 -1，由 AnchorNav 的越界判断静默忽略 */
  function scrollToIndex(index: string) {
    anchorNavRef.current?.scrollToSection(items.findIndex(item => item.title === index));
  }

  function renderSidebar(context: AnchorNavSidebarContext) {
    return (
      <View className={slotClassNames.sidebar}>
        {items.map((item, index) => (
          <IndexBarSidebarItem
            key={item.title}
            active={index === context.activeIndex}
            classNames={classNames}
            index={item.title}
            onPress={() => context.onPressIndex(index)}
          />
        ))}
      </View>
    );
  }

  useImperativeHandle(ref, () => ({ scrollToIndex }));

  return (
    <AnchorNav
      ref={anchorNavRef}
      className={className}
      classNames={anchorNavClassNames}
      haptic={haptic}
      itemHeight={itemHeight}
      items={items}
      renderItem={renderItem}
      renderSidebar={renderSidebar}
      sectionHeaderHeight={sectionHeaderHeight}
      sticky={sticky}
      onIndexChange={handleIndexChange}
      onPressItem={onPressItem}
      {...restProps}
    />
  );
};

export { IndexBar };
