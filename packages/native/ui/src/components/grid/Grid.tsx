import { cn, isNil, isNumber, isString } from '@skyroc/utils';
import { Pressable, StyleSheet, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { Text } from '../text/Typography';
import { gridVariants } from './grid-variants';
import type { GridItemData, GridProps } from './types';

/** 分隔线粗细，0.5/0.33dp 没有对应工具类，只能落到 style */
const HAIRLINE = StyleSheet.hairlineWidth;

/**
 * 宫格组件。
 *
 * Gutter 用「每个格子四周内边距 gutter/2 + 容器四周负外边距 gutter/2」实现， 而不是给格子加 paddingRight：后者会在最后一列多留一条空白、把内容整体挤向左侧， square
 * 时还会把间距算进正方形里。负外边距抵消最外圈留白，宫格仍与相邻内容贴边对齐。
 *
 * 分隔线画在格子外框上（边框在内边距之外），因此有 gutter 时线正好落在间距的中线。
 */
const Grid = (props: GridProps) => {
  const {
    border = false,
    center = true,
    className,
    classNames,
    clickable = false,
    columnNum = 4,
    direction = 'vertical',
    gutter = 0,
    items,
    ref,
    reverse = false,
    square = false,
    style,
    ...rest
  } = props;

  const variantSlots = gridVariants({ center, direction, reverse, square });

  const halfGutter = gutter / 2;

  /** 末行首项的下标；items 数量不是列数整数倍时，末行由余数决定 */
  const lastRowStartIndex = items.length - (items.length % columnNum || columnNum);

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      content: cn(variantSlots.content(), classNames?.content),
      icon: cn(variantSlots.icon(), classNames?.icon),
      root: cn(variantSlots.root(), className, classNames?.root),
      text: cn(variantSlots.text(), classNames?.text)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  /** 格子外框的类名随每项的可点击态与禁用态变化，只能逐项解析 */
  function resolveItemClassName(item: GridItemData, pressable: boolean) {
    const itemSlots = gridVariants({ clickable: pressable, disabled: item.disabled });

    return cn(itemSlots.item(), classNames?.item, item.classNames?.item);
  }

  /** 列宽、间距、分隔线都依赖运行时的 columnNum / gutter，无法用类名表达 */
  function resolveItemStyle(index: number): ViewStyle {
    const isRowEnd = (index + 1) % columnNum === 0;
    const isLastItem = index === items.length - 1;
    const isLastRow = index >= lastRowStartIndex;

    return {
      flexBasis: `${100 / columnNum}%`,
      padding: halfGutter,
      // 末行与每行末项不画线，末行不满时最后一项也不画，避免竖线悬在空白区
      ...(border && {
        borderBottomWidth: isLastRow ? 0 : HAIRLINE,
        borderRightWidth: isRowEnd || isLastItem ? 0 : HAIRLINE
      })
    };
  }

  function renderIcon(item: GridItemData) {
    if (isNil(item.icon)) return null;

    return <View className={cn(slotClassNames.icon, item.classNames?.icon)}>{item.icon}</View>;
  }

  /** Number 也要包 Text：RN 里裸数字会抛 "Text strings must be rendered within a <Text>" */
  function renderText(item: GridItemData) {
    if (isNil(item.text)) return null;

    if (isString(item.text) || isNumber(item.text)) {
      return <Text className={cn(slotClassNames.text, item.classNames?.text)}>{item.text}</Text>;
    }

    return item.text;
  }

  function renderItem(item: GridItemData, index: number) {
    const disabled = Boolean(item.disabled);
    const pressable = clickable || Boolean(item.onPress || item.onLongPress);

    const itemClassName = resolveItemClassName(item, pressable && !disabled);
    const itemStyle = resolveItemStyle(index);

    const content = (
      <View className={cn(slotClassNames.content, item.classNames?.content)}>
        {isNil(item.children) ? (
          <>
            {renderIcon(item)}
            {renderText(item)}
          </>
        ) : (
          item.children
        )}
      </View>
    );

    if (!pressable) {
      return (
        <View
          key={item.key}
          accessibilityLabel={item.accessibilityLabel}
          className={itemClassName}
          style={itemStyle}
          testID={item.testID}
        >
          {content}
        </View>
      );
    }

    return (
      <Pressable
        key={item.key}
        accessibilityLabel={item.accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        className={itemClassName}
        disabled={disabled}
        style={itemStyle}
        testID={item.testID}
        onLongPress={item.onLongPress}
        onPress={item.onPress}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      ref={ref}
      className={slotClassNames.root}
      style={gutter > 0 ? [{ margin: -halfGutter }, style] : style}
      {...rest}
    >
      {items.map((item, index) => renderItem(item, index))}
    </View>
  );
};

export { Grid };
