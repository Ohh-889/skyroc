import { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import * as Haptics from 'expo-haptics';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { DropdownMenuBar } from './DropdownMenuBar';
import { DropdownMenuPanel } from './DropdownMenuPanel';
import { dropdownMenuVariants } from './dropdown-menu-variants';
import type { DropdownMenuOption, DropdownMenuProps } from './types';

const DropdownMenu = (props: DropdownMenuProps) => {
  const {
    className,
    classNames,
    closeOnSelect = true,
    defaultValues,
    direction = 'down',
    duration = 200,
    items,
    onSelect,
    onValuesChange,
    overlay = true,
    showDivider = true,
    values: valuesProp
  } = props;

  const initialValues = defaultValues ?? items.map(item => item.options[0]?.value);

  const [values, setValues] = useControllableState<(number | string | undefined)[]>({
    caller: 'dropdown-menu',
    defaultProp: initialValues,
    onChange: onValuesChange,
    prop: valuesProp
  });

  /** 当前高亮的标题索引，-1 表示无 */
  const [activeItemIndex, setActiveItemIndex] = useState(-1);
  /** 当前面板渲染的选项组索引，关闭动画完成后才置 -1 */
  const [visibleItemIndex, setVisibleItemIndex] = useState(-1);
  const [barHeight, setBarHeight] = useState(0);

  /** 关闭动画完成后需要打开的索引 */
  const pendingOpenIndex = useRef(-1);
  /** 关闭动画定时器 */
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** 是否正在等待内容测量以启动展开动画 */
  const isOpening = useRef(false);

  const contentHeight = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  const panelVisible = visibleItemIndex >= 0;
  const displayedOptions = items[visibleItemIndex]?.options ?? [];
  const selectedValue = values[visibleItemIndex] ?? '';

  const slots = dropdownMenuVariants({ opened: panelVisible });

  /** 各标题的显示文本 */
  const titleTexts = useMemo(() => {
    return items.map((item, index) => {
      if (item.title) return item.title;
      const val = values[index];
      const opt = item.options.find(o => o.value === val);
      return opt?.text ?? '';
    });
  }, [items, values]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  function handleBarLayout(e: LayoutChangeEvent) {
    setBarHeight(e.nativeEvent.layout.height);
  }

  /** 内容 View 布局完成后，用实测高度驱动展开动画 */
  function handleContentMeasured(height: number) {
    if (isOpening.current && height > 0) {
      isOpening.current = false;
      contentHeight.value = withTiming(height, { duration });
    }
  }

  function onCloseComplete() {
    const pending = pendingOpenIndex.current;
    pendingOpenIndex.current = -1;

    if (pending >= 0) {
      openPanel(pending);
    } else {
      setVisibleItemIndex(-1);
    }
  }

  function openPanel(index: number) {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    isOpening.current = true;
    setActiveItemIndex(index);
    setVisibleItemIndex(index);
    overlayOpacity.value = withTiming(1, { duration });
  }

  function closePanel() {
    setActiveItemIndex(-1);
    isOpening.current = false;
    contentHeight.value = withTiming(0, { duration });
    overlayOpacity.value = withTiming(0, { duration });

    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(onCloseComplete, duration);
  }

  function handleTitlePress(index: number) {
    if (items[index]?.disabled) return;

    if (activeItemIndex === index) {
      closePanel();
    } else if (activeItemIndex >= 0) {
      Haptics.selectionAsync();
      pendingOpenIndex.current = index;
      closePanel();
    } else {
      openPanel(index);
    }
  }

  function handleOptionPress(option: DropdownMenuOption) {
    if (option.disabled || activeItemIndex < 0) return;

    const newValues = [...values];
    newValues[activeItemIndex] = option.value;
    setValues(newValues);
    onSelect?.(activeItemIndex, option);

    if (closeOnSelect) {
      closePanel();
    }
  }

  function handleOverlayPress() {
    closePanel();
  }

  return (
    <View className={cn(slots.root(), classNames?.root, className)}>
      <DropdownMenuBar
        activeItemIndex={activeItemIndex}
        classNames={classNames}
        direction={direction}
        duration={duration}
        items={items}
        onLayout={handleBarLayout}
        onTitlePress={handleTitlePress}
        titleTexts={titleTexts}
      />

      {panelVisible && (
        <DropdownMenuPanel
          key={visibleItemIndex}
          barHeight={barHeight}
          classNames={classNames}
          contentHeight={contentHeight}
          direction={direction}
          onContentMeasured={handleContentMeasured}
          onOptionPress={handleOptionPress}
          onOverlayPress={handleOverlayPress}
          options={displayedOptions}
          overlay={overlay}
          overlayOpacity={overlayOpacity}
          selectedValue={selectedValue}
          showDivider={showDivider}
        />
      )}
    </View>
  );
};

export { DropdownMenu };
