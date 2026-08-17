import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { Pressable, View } from 'react-native';
import { Button } from '../button/Button';
import { PickerView } from '../picker/PickerView';
import { Text } from '../text/Typography';
import { pickerGroupVariants } from './picker-group-variants';
import type { PickerGroupViewProps } from './types';

/** 内联分组选择器，多个 PickerView 共用一套工具栏，按 tab 逐个填 */
const PickerGroupView = (props: PickerGroupViewProps) => {
  const {
    activeTab: activeTabProp,
    cancelText = '取消',
    className,
    classNames,
    confirmText = '确定',
    defaultActiveTab = 0,
    defaultValues,
    nextStepText = '下一步',
    onCancel,
    onChange,
    onConfirm,
    onTabChange,
    pickers,
    showTabBar = true,
    showToolbar = true,
    values: valuesProp
  } = props;

  const [activeTab, setActiveTab] = useControllableState({
    caller: 'PickerGroupView',
    defaultProp: defaultActiveTab,
    onChange: onTabChange,
    prop: activeTabProp
  });

  // defaultProp 只在挂载时被读一次，这里每次渲染重算不会影响已有选中值
  const [allValues, setAllValues] = useControllableState<string[][]>({
    caller: 'PickerGroupView',
    defaultProp: defaultValues ?? pickers.map(picker => picker.defaultValue ?? []),
    prop: valuesProp
  });

  const variantSlots = pickerGroupVariants();

  // pickers 变短时 activeTab 可能越界，取不到就整块不渲染
  const activePicker = pickers[activeTab];
  const isLastTab = activeTab >= pickers.length - 1;

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      cancel: cn(variantSlots.cancel(), classNames?.cancel),
      cancelText: cn(variantSlots.cancelText(), classNames?.cancelText),
      confirm: cn(variantSlots.confirm(), classNames?.confirm),
      confirmText: cn(variantSlots.confirmText(), classNames?.confirmText),
      root: cn(variantSlots.root(), classNames?.root, className),
      tabBar: cn(variantSlots.tabBar(), classNames?.tabBar),
      toolbar: cn(variantSlots.toolbar(), classNames?.toolbar)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  /** 单个 tab 的类名随激活态变化，只能逐项解析 */
  function resolveTabClassNames(active: boolean) {
    const tabSlots = pickerGroupVariants({ active });

    return {
      activeIndicator: cn(tabSlots.activeIndicator(), classNames?.activeIndicator),
      tab: cn(tabSlots.tab(), classNames?.tab),
      tabText: cn(tabSlots.tabText(), classNames?.tabText)
    };
  }

  // 同一时刻只有激活的那个 picker 挂着，变化必然来自它，下标直接取 activeTab
  function handlePickerChange(values: string[]) {
    const nextValues = [...allValues];
    nextValues[activeTab] = values;

    setAllValues(nextValues);
    onChange?.(nextValues, activeTab);
  }

  // 主按钮在非末尾 tab 上是「下一步」，走到最后一个才是「确定」
  function handleConfirmOrNext() {
    if (isLastTab) {
      onConfirm?.(allValues);
      return;
    }

    setActiveTab(activeTab + 1);
  }

  function handleCancel() {
    onCancel?.(allValues);
  }

  function handleTabPress(index: number) {
    setActiveTab(index);
  }

  return (
    <View className={slotClassNames.root}>
      {showToolbar ? (
        <View className={slotClassNames.toolbar}>
          <Button
            className={slotClassNames.cancel}
            classNames={{ text: slotClassNames.cancelText }}
            color="muted"
            size="md"
            variant="ghost"
            onPress={handleCancel}
          >
            {cancelText}
          </Button>

          <Button
            className={slotClassNames.confirm}
            classNames={{ text: slotClassNames.confirmText }}
            color="primary"
            size="md"
            variant="ghost"
            onPress={handleConfirmOrNext}
          >
            {isLastTab ? confirmText : nextStepText}
          </Button>
        </View>
      ) : null}

      {/* 只有一个 picker 时 tab 栏没有意义，直接省掉 */}
      {showTabBar && pickers.length > 1 ? (
        <View className={slotClassNames.tabBar}>
          {pickers.map((picker, index) => {
            const isActive = index === activeTab;
            const tabClassNames = resolveTabClassNames(isActive);

            return (
              <Pressable
                key={picker.key ?? index}
                className={tabClassNames.tab}
                onPress={() => handleTabPress(index)}
              >
                <Text className={tabClassNames.tabText}>{picker.title}</Text>
                {isActive ? <View className={tabClassNames.activeIndicator} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {/* key 随 tab 变化，切 tab 时整块重建：两个 tab 的列数与级联结构可能完全不同，复用同一棵滚轮反而要多做一轮修正 */}
      {activePicker ? (
        <PickerView
          key={activePicker.key ?? activeTab}
          classNames={activePicker.classNames}
          columns={activePicker.columns}
          fieldNames={activePicker.fieldNames}
          haptic={activePicker.haptic}
          itemHeight={activePicker.itemHeight}
          loading={activePicker.loading}
          showToolbar={false}
          value={allValues[activeTab] ?? []}
          visibleCount={activePicker.visibleCount}
          onChange={handlePickerChange}
        />
      ) : null}
    </View>
  );
};

export { PickerGroupView };
