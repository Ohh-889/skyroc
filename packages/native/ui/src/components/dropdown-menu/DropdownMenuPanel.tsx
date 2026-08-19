import Feather from '@expo/vector-icons/Feather';
import { cn } from '@skyroc/utils';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { Divider } from '../divider/Divider';
import { Text } from '../text/Typography';
import { dropdownMenuVariants } from './dropdown-menu-variants';
import type { DropdownMenuPanelProps } from './types';

/** Feather 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，让勾选色跟随主题 token */
const CheckIcon = withUniwind(Feather);

/** 勾选图标边长（px） */
const CHECK_SIZE = 16;

/** 面板默认最大高度占屏幕的比例，超出后面板内部滚动 */
const MAX_HEIGHT_RATIO = 0.8;

/**
 * 下拉面板：遮罩 + 选项列表。
 *
 * 内容挂在绝对定位的测量层里，才能在高度动画容器之外测出自然高度；容器再拿这个高度做展开动画。
 */
const DropdownMenuPanel = (props: DropdownMenuPanelProps) => {
  const {
    barHeight,
    classNames,
    contentHeight,
    direction,
    maxHeight,
    onContentMeasured,
    onOptionPress,
    onOverlayPress,
    options,
    overlay,
    overlayOpacity,
    selectedValue,
    showDivider
  } = props;

  const { height: windowHeight } = useWindowDimensions();

  const variantSlots = dropdownMenuVariants({ direction });

  const wrapperStyle = useAnimatedStyle(
    () => ({
      height: contentHeight.value
    }),
    [contentHeight]
  );

  const overlayStyle = useAnimatedStyle(
    () => ({
      opacity: overlayOpacity.value
    }),
    [overlayOpacity]
  );

  /**
   * 面板锚在标题栏的哪一侧，并铺满剩下的一屏。
   *
   * 容器撑到一屏是为了兜住遮罩：Android 不会把点击派发给超出父容器范围的子节点，遮罩比容器大就点不动。 容器自身挂 `box-none`，没遮罩时整屏范围内的点击照常落到底下的页面上。
   */
  const panelStyle = { height: windowHeight, ...(direction === 'down' ? { top: barHeight } : { bottom: barHeight }) };

  const contentSizeStyle = { maxHeight: maxHeight ?? windowHeight * MAX_HEIGHT_RATIO };

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      content: cn(variantSlots.content(), classNames?.content),
      divider: cn(variantSlots.divider(), classNames?.divider),
      measure: variantSlots.measure(),
      overlay: cn(variantSlots.overlay(), classNames?.overlay),
      panel: variantSlots.panel(),
      wrapper: variantSlots.wrapper()
    };
  }

  const slotClassNames = resolveSlotClassNames();

  /** 单个选项的类名随选中态与禁用态变化，只能逐项解析 */
  function resolveOptionClassNames(selected: boolean, disabled: boolean) {
    const optionSlots = dropdownMenuVariants({ active: selected, direction, disabled });

    return {
      option: cn(optionSlots.option(), classNames?.option),
      optionText: cn(optionSlots.optionText(), classNames?.optionText),
      selectedIcon: cn(optionSlots.selectedIcon(), classNames?.selectedIcon)
    };
  }

  function handleContentLayout(e: LayoutChangeEvent) {
    onContentMeasured(e.nativeEvent.layout.height);
  }

  return (
    <View
      className={slotClassNames.panel}
      pointerEvents="box-none"
      style={panelStyle}
    >
      {overlay && (
        <Animated.View
          className={slotClassNames.overlay}
          style={overlayStyle}
        >
          <Pressable
            className="flex-1"
            onPress={onOverlayPress}
          />
        </Animated.View>
      )}

      <Animated.View
        className={slotClassNames.wrapper}
        style={wrapperStyle}
      >
        <View className={slotClassNames.measure}>
          <ScrollView
            bounces={false}
            className={slotClassNames.content}
            nestedScrollEnabled
            style={contentSizeStyle}
            onLayout={handleContentLayout}
          >
            {options.map((option, index) => {
              const selected = selectedValue === option.value;
              const optionClassNames = resolveOptionClassNames(selected, Boolean(option.disabled));

              return (
                <View key={option.value}>
                  {showDivider && index > 0 && <Divider className={slotClassNames.divider} />}

                  <Pressable
                    className={optionClassNames.option}
                    disabled={option.disabled}
                    onPress={() => onOptionPress(option)}
                  >
                    <Text className={optionClassNames.optionText}>{option.text}</Text>

                    {selected && (
                      <CheckIcon
                        colorClassName={optionClassNames.selectedIcon}
                        name="check"
                        size={CHECK_SIZE}
                      />
                    )}
                  </Pressable>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
};

export { DropdownMenuPanel };
