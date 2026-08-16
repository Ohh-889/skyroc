import { Pressable, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { cn } from '@skyroc/utils';
import type { SharedValue } from 'react-native-reanimated';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Divider } from '../divider/Divider';
import { Text } from '../text/Typography';
import type { SlotClassNames } from '../../types/shared';
import { dropdownMenuVariants } from './dropdown-menu-variants';
import type { DropdownMenuDirection, DropdownMenuOption, DropdownMenuSlots } from './types';

/** 下拉面板属性 */
interface DropdownMenuPanelProps {
  /** 标题栏高度，用于绝对定位 */
  barHeight: number;

  /** 各插槽自定义 className */
  classNames?: SlotClassNames<DropdownMenuSlots>;

  /** 内容高度动画值 */
  contentHeight: SharedValue<number>;

  /** 展开方向 */
  direction: DropdownMenuDirection;

  /** 内容布局测量回调 */
  onContentMeasured: (height: number) => void;

  /** 选项点击回调 */
  onOptionPress: (option: DropdownMenuOption) => void;

  /** 遮罩点击回调 */
  onOverlayPress: () => void;

  /** 当前显示的选项列表 */
  options: DropdownMenuOption[];

  /** 是否显示遮罩 */
  overlay: boolean;

  /** 遮罩透明度动画值 */
  overlayOpacity: SharedValue<number>;

  /** 当前选中值 */
  selectedValue: number | string | undefined;

  /** 是否显示选项间的分隔线 */
  showDivider: boolean;
}

/** 下拉菜单面板（遮罩 + 选项列表） */
const DropdownMenuPanel = (props: DropdownMenuPanelProps) => {
  const {
    barHeight,
    classNames,
    contentHeight,
    direction,
    onContentMeasured,
    onOptionPress,
    onOverlayPress,
    options,
    overlay,
    overlayOpacity,
    selectedValue,
    showDivider
  } = props;

  const slots = dropdownMenuVariants();

  const contentAnimStyle = useAnimatedStyle(() => ({
    height: contentHeight.value,
    overflow: 'hidden' as const
  }));

  const overlayAnimStyle = useAnimatedStyle(() => ({
    flex: 1,
    opacity: overlayOpacity.value,
    backgroundColor: 'rgba(0,0,0,0.4)'
  }));

  function handleContentLayout(e: LayoutChangeEvent) {
    onContentMeasured(e.nativeEvent.layout.height);
  }

  return (
    <View
      style={{
        left: 0,
        position: 'absolute',
        right: 0,
        ...(direction === 'down' ? { top: barHeight } : { bottom: barHeight })
      }}
    >
      {/* Overlay */}
      {overlay && (
        <Pressable
          onPress={onOverlayPress}
          style={{
            left: 0,
            position: 'absolute',
            right: 0,
            ...(direction === 'down' ? { height: 9999, top: 0 } : { bottom: 0, height: 9999 })
          }}
        >
          <Animated.View style={overlayAnimStyle} />
        </Pressable>
      )}

      {/* Content */}
      <Animated.View style={contentAnimStyle}>
        <View style={{ left: 0, position: 'absolute', right: 0, top: 0, zIndex: 100 }}>
          <View
            className={cn(
              slots.content(),
              direction === 'down' ? 'rounded-b-2xl' : 'rounded-t-2xl',
              classNames?.content
            )}
            onLayout={handleContentLayout}
          >
            {options.map((option, index) => {
              const selected = selectedValue === option.value;
              const optionSlots = dropdownMenuVariants({
                active: selected,
                disabled: Boolean(option.disabled)
              });

              return (
                <View key={option.value}>
                  {showDivider && index > 0 && <Divider className="mx-4 my-0" />}
                  <Pressable
                    className={cn(optionSlots.option(), classNames?.option)}
                    disabled={option.disabled}
                    onPress={() => onOptionPress(option)}
                  >
                    <Text className={cn(optionSlots.optionText(), classNames?.optionText)}>{option.text}</Text>
                    {selected && (
                      <Feather
                        color={'#000'}
                        name="check"
                        size={16}
                      />
                    )}
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export { DropdownMenuPanel };
export type { DropdownMenuPanelProps };
