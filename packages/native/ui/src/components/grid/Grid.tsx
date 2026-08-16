import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { cn, isString } from '@skyroc/utils';
import { Text } from '../text/Typography';
import { GRID_BORDER_COLOR } from './constants';
import { gridItemVariants } from './grid-variants';
import type { GridItemSlots, GridProps } from './types';

const Grid = (props: GridProps) => {
  const {
    border = false,
    center = true,
    clickable = false,
    columnNum = 4,
    direction = 'vertical',
    gutter = 0,
    items,
    reverse = false,
    square = false
  } = props;

  const slots = gridItemVariants({ center, direction, reverse, square });

  function renderIcon(icon: ReactNode, itemClassNames?: Partial<Record<GridItemSlots, string>>) {
    if (!icon) return null;
    return <View className={cn(slots.iconSlot(), itemClassNames?.iconSlot)}>{icon}</View>;
  }

  function renderText(text: ReactNode, itemClassNames?: Partial<Record<GridItemSlots, string>>) {
    if (!text) return null;
    if (isString(text)) {
      return <Text className={cn(slots.text(), itemClassNames?.text)}>{text}</Text>;
    }
    return text;
  }

  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap' }, gutter > 0 && { rowGap: gutter }]}>
      {items.map((item, index) => {
        const isClickable = clickable || Boolean(item.onPress);
        const Wrapper = isClickable ? Pressable : View;
        const wrapperProps = isClickable ? { onPress: item.onPress } : {};

        const isLastColumn = (index + 1) % columnNum === 0;
        const isLastRow = index >= items.length - (items.length % columnNum || columnNum);

        return (
          <Wrapper
            key={item.key ?? index}
            style={[
              { flexBasis: `${100 / columnNum}%`, overflow: 'hidden', paddingRight: gutter },
              square && { aspectRatio: 1 },
              border && {
                borderColor: GRID_BORDER_COLOR,
                borderBottomWidth: isLastRow ? 0 : StyleSheet.hairlineWidth,
                borderRightWidth: isLastColumn ? 0 : StyleSheet.hairlineWidth
              }
            ]}
            {...wrapperProps}
          >
            <View className={cn(slots.content(), item.className, item.classNames?.content)}>
              {item.children || (
                <>
                  {renderIcon(item.icon, item.classNames)}
                  {renderText(item.text, item.classNames)}
                </>
              )}
            </View>
          </Wrapper>
        );
      })}
    </View>
  );
};

export { Grid };
