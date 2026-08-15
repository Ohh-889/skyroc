import AntDesign from '@expo/vector-icons/AntDesign';
import { cn, isString } from '@skyroc/utils';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { Text } from '../text/Typography';
import { ARROW_SIZE_MAP, cellVariants } from './cell-variants';
import type { CellProps } from './types';

/** AntDesign 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，让箭头色跟随主题 token */
const ArrowIcon = withUniwind(AntDesign);

const Cell = (props: CellProps) => {
  const {
    accessibilityLabel,
    arrow,
    arrowDirection = 'right',
    center,
    classNames,
    disabled = false,
    leading,
    onLongPress,
    onPress,
    showArrow,
    size = 'md',
    subtitle,
    testID,
    title,
    trailing
  } = props;

  const pressable = Boolean(onPress || onLongPress);
  const shouldShowArrow = showArrow ?? (Boolean(arrow) || pressable);

  const {
    arrow: arrowCls,
    arrowIcon: arrowIconCls,
    content: contentCls,
    leading: leadingCls,
    root: rootCls,
    subtitle: subtitleCls,
    title: titleCls,
    trailing: trailingCls,
    trailingText: trailingTextCls
  } = cellVariants({ center, disabled, size });

  function renderTrailing() {
    if (!trailing) return null;
    return (
      <View className={cn(trailingCls(), classNames?.trailing)}>
        {isString(trailing) ? (
          <Text className={cn(trailingTextCls(), classNames?.trailingText)}>{trailing}</Text>
        ) : (
          trailing
        )}
      </View>
    );
  }

  function renderArrow() {
    if (!shouldShowArrow) return null;
    return (
      <View className={cn(arrowCls(), classNames?.arrow)}>
        {arrow ?? (
          <ArrowIcon
            colorClassName={arrowIconCls()}
            name={arrowDirection}
            size={ARROW_SIZE_MAP[size]}
          />
        )}
      </View>
    );
  }

  const content = (
    <>
      {leading ? <View className={cn(leadingCls(), classNames?.leading)}>{leading}</View> : null}
      <View className={cn(contentCls(), classNames?.content)}>
        {isString(title) ? <Text className={cn(titleCls(), classNames?.title)}>{title}</Text> : title}
        {isString(subtitle) ? <Text className={cn(subtitleCls(), classNames?.subtitle)}>{subtitle}</Text> : subtitle}
      </View>
      {renderTrailing()}
      {renderArrow()}
    </>
  );

  if (pressable) {
    return (
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        className={cn(rootCls(), classNames?.root)}
        disabled={disabled}
        onLongPress={onLongPress}
        onPress={onPress}
        testID={testID}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      className={cn(rootCls(), classNames?.root)}
      testID={testID}
    >
      {content}
    </View>
  );
};

export { Cell };
