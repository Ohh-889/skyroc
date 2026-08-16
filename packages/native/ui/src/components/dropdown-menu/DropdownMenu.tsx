import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import * as Haptics from 'expo-haptics';
import { useImperativeHandle, useRef, useState } from 'react';
import { View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';
import { dropdownMenuVariants } from './dropdown-menu-variants';
import { DropdownMenuBar } from './DropdownMenuBar';
import { DropdownMenuPanel } from './DropdownMenuPanel';
import type { DropdownMenuItem, DropdownMenuOption, DropdownMenuProps, DropdownMenuValue } from './types';

/** 各项的初始选中值：调用方没给的那项回退到第一个选项，免得标题一片空白 */
function resolveDefaultValues(items: DropdownMenuItem[], defaultValues?: (DropdownMenuValue | undefined)[]) {
  return items.map((item, index) => defaultValues?.[index] ?? item.options[0]?.value);
}

/** 标题文本：优先自定义标题，否则显示当前选中项 */
function resolveTitleText(item: DropdownMenuItem, value: DropdownMenuValue | undefined) {
  if (item.title) return item.title;

  return item.options.find(option => option.value === value)?.text ?? '';
}

/**
 * 下拉菜单。
 *
 * 状态机只有三态：关闭（两个索引都是 -1）、展开（两个索引相同）、收起中（`activeIndex` 已置 -1、 `visibleIndex` 仍指向正在退场的那一组）。收起动画播完才把 `visibleIndex` 归位，因此面板卸载与动画
 * 严格同步，不靠定时器估算。
 */
const DropdownMenu = (props: DropdownMenuProps) => {
  const {
    className,
    classNames,
    closeOnSelect = true,
    defaultValues,
    direction = 'down',
    duration = 200,
    haptic = true,
    items,
    maxHeight,
    onOpenChange,
    onSelect,
    onValuesChange,
    overlay = true,
    ref,
    showDivider = true,
    values: valuesProp
  } = props;

  const [values, setValues] = useControllableState<(DropdownMenuValue | undefined)[]>({
    caller: 'dropdown-menu',
    defaultProp: resolveDefaultValues(items, defaultValues),
    onChange: onValuesChange,
    prop: valuesProp
  });

  /** 当前展开的标题索引，-1 表示已关闭；收起动画期间就已经是 -1 */
  const [activeIndex, setActiveIndex] = useState(-1);
  /** 面板正在渲染的选项组索引，收起动画播完才置 -1 */
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [barHeight, setBarHeight] = useState(0);

  /** 是否在等内容测量结果来启动展开动画 */
  const isOpeningRef = useRef(false);
  /** 收起动画的序号：开 / 关都自增，回调里对不上号说明这次收起已被新的交互作废 */
  const closeSeqRef = useRef(0);

  const contentHeight = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  const panelVisible = visibleIndex >= 0;
  const displayedOptions = items[visibleIndex]?.options ?? [];
  const selectedValue = values[visibleIndex];

  const titleTexts = items.map((item, index) => resolveTitleText(item, values[index]));

  const variantSlots = dropdownMenuVariants({ direction, opened: panelVisible });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      root: cn(variantSlots.root(), classNames?.root, className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function triggerHaptic() {
    if (haptic) Haptics.selectionAsync();
  }

  /** 收起动画的落幕回调，序号对不上说明期间又被展开了，此时不能把面板卸载掉 */
  function finishClose(seq: number) {
    if (seq !== closeSeqRef.current) return;

    setVisibleIndex(-1);
  }

  function openPanel(index: number) {
    if (items[index]?.disabled) return;

    // 作废还在路上的收起回调：切换菜单项时旧面板的动画可能尚未播完
    closeSeqRef.current += 1;
    isOpeningRef.current = true;

    setActiveIndex(index);
    setVisibleIndex(index);

    // 切换菜单项时遮罩本来就停在 1，这里不会淡出再淡入，只有从关闭态展开才真正淡入
    overlayOpacity.value = withTiming(1, { duration });

    onOpenChange?.(index);
  }

  function closePanel() {
    if (activeIndex < 0) return;

    closeSeqRef.current += 1;
    const seq = closeSeqRef.current;

    isOpeningRef.current = false;
    setActiveIndex(-1);

    contentHeight.value = withTiming(0, { duration }, finished => {
      // 被新的展开动画打断时 finished 为 false，面板要留在原地继续演下一场
      if (finished) runOnJS(finishClose)(seq);
    });
    overlayOpacity.value = withTiming(0, { duration });

    onOpenChange?.(-1);
  }

  function handleBarLayout(e: LayoutChangeEvent) {
    setBarHeight(e.nativeEvent.layout.height);
  }

  /** 内容测量完成：展开中用它启动动画，已展开时用它跟随选项增删带来的高度变化 */
  function handleContentMeasured(height: number) {
    if (height <= 0) return;

    if (isOpeningRef.current) {
      isOpeningRef.current = false;
      contentHeight.value = withTiming(height, { duration });
      return;
    }

    if (activeIndex >= 0) {
      contentHeight.value = withTiming(height, { duration });
    }
  }

  function handleTitlePress(index: number) {
    if (items[index]?.disabled) return;

    triggerHaptic();

    if (activeIndex === index) {
      closePanel();
      return;
    }

    openPanel(index);
  }

  function handleOptionPress(option: DropdownMenuOption) {
    if (option.disabled || activeIndex < 0) return;

    triggerHaptic();

    const newValues = [...values];
    newValues[activeIndex] = option.value;
    setValues(newValues);
    onSelect?.(activeIndex, option);

    if (closeOnSelect) {
      closePanel();
    }
  }

  useImperativeHandle(ref, () => ({ close: closePanel, open: openPanel }));

  return (
    <View className={slotClassNames.root}>
      <DropdownMenuBar
        activeIndex={activeIndex}
        classNames={classNames}
        direction={direction}
        duration={duration}
        items={items}
        titleTexts={titleTexts}
        onLayout={handleBarLayout}
        onTitlePress={handleTitlePress}
      />

      {panelVisible && (
        // key 让切换菜单项时面板重新挂载，onLayout 必定回调一次，新选项组的高度才测得到
        <DropdownMenuPanel
          key={visibleIndex}
          barHeight={barHeight}
          classNames={classNames}
          contentHeight={contentHeight}
          direction={direction}
          maxHeight={maxHeight}
          options={displayedOptions}
          overlay={overlay}
          overlayOpacity={overlayOpacity}
          selectedValue={selectedValue}
          showDivider={showDivider}
          onContentMeasured={handleContentMeasured}
          onOptionPress={handleOptionPress}
          onOverlayPress={closePanel}
        />
      )}
    </View>
  );
};

export { DropdownMenu };
