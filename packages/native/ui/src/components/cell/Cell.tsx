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

  const variantSlots = cellVariants({ center, disabled, size });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      arrow: cn(variantSlots.arrow(), classNames?.arrow),
      arrowIcon: variantSlots.arrowIcon(),
      content: cn(variantSlots.content(), classNames?.content),
      leading: cn(variantSlots.leading(), classNames?.leading),
      root: cn(variantSlots.root(), classNames?.root),
      subtitle: cn(variantSlots.subtitle(), classNames?.subtitle),
      title: cn(variantSlots.title(), classNames?.title),
      trailing: cn(variantSlots.trailing(), classNames?.trailing),
      trailingText: cn(variantSlots.trailingText(), classNames?.trailingText)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function renderTrailing() {
    if (!trailing) return null;
    return (
      <View className={slotClassNames.trailing}>
        {isString(trailing) ? <Text className={slotClassNames.trailingText}>{trailing}</Text> : trailing}
      </View>
    );
  }

  function renderArrow() {
    if (!shouldShowArrow) return null;
    return (
      <View className={slotClassNames.arrow}>
        {arrow ?? (
          <ArrowIcon
            colorClassName={slotClassNames.arrowIcon}
            name={arrowDirection}
            size={ARROW_SIZE_MAP[size]}
          />
        )}
      </View>
    );
  }

  const content = (
    <>
      {leading ? <View className={slotClassNames.leading}>{leading}</View> : null}
      <View className={slotClassNames.content}>
        {isString(title) ? <Text className={slotClassNames.title}>{title}</Text> : title}
        {isString(subtitle) ? <Text className={slotClassNames.subtitle}>{subtitle}</Text> : subtitle}
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
        className={slotClassNames.root}
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
      className={slotClassNames.root}
      testID={testID}
    >
      {content}
    </View>
  );
};

export { Cell };
