import { useRef } from 'react';
import { Pressable, View } from 'react-native';
import { cn } from '@skyroc/utils';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Button } from '../button/Button';
import { PickerView } from '../picker/PickerView';
import { Text } from '../text/Typography';
import { pickerGroupVariants } from './picker-group-variants';
import type { PickerGroupViewProps } from './types';

const PickerGroupView = (props: PickerGroupViewProps) => {
  const {
    activeTab: activeTabProp,
    cancelText = 'Cancel',
    className,
    classNames,
    confirmText = 'Confirm',
    defaultActiveTab = 0,
    defaultValues,
    nextStepText = 'Next',
    onChange,
    onCancel,
    onConfirm,
    onTabChange,
    pickers,
    showTabBar = true,
    showToolbar = true,
    values: valuesProp
  } = props;

  const initialValuesRef = useRef(defaultValues ?? pickers.map(p => p.defaultValue ?? []));

  const [activeTab, setActiveTab] = useControllableState({
    caller: 'PickerGroupView',
    defaultProp: defaultActiveTab,
    onChange: onTabChange,
    prop: activeTabProp
  });

  const [allValues, setAllValues] = useControllableState<string[][]>({
    caller: 'PickerGroupView',
    defaultProp: initialValuesRef.current,
    prop: valuesProp
  });

  const slots = pickerGroupVariants();
  const isLastTab = activeTab >= pickers.length - 1;

  function handlePickerChange(values: string[], pickerIndex: number) {
    const next = [...allValues];
    next[pickerIndex] = values;
    setAllValues(next);
    onChange?.(next, pickerIndex);
  }

  function handleConfirmOrNext() {
    if (isLastTab) {
      onConfirm?.(allValues);
    } else {
      setActiveTab(activeTab + 1);
    }
  }

  function handleCancel() {
    onCancel?.(allValues);
  }

  function handleTabPress(index: number) {
    setActiveTab(index);
  }

  return (
    <View className={cn(slots.root(), className)}>
      {/* Toolbar */}
      {showToolbar ? (
        <View className={cn(slots.toolbar(), classNames?.toolbar)}>
          <Button
            color="muted"
            size="sm"
            variant="ghost"
            onPress={handleCancel}
          >
            {cancelText}
          </Button>

          <Button
            color="primary"
            size="sm"
            variant="ghost"
            onPress={handleConfirmOrNext}
          >
            {isLastTab ? confirmText : nextStepText}
          </Button>
        </View>
      ) : null}

      {/* Tab Bar */}
      {showTabBar && pickers.length > 1 ? (
        <View className={cn(slots.tabBar(), classNames?.tabBar)}>
          {pickers.map((picker, index) => (
            <Pressable
              key={picker.key ?? index}
              className={cn(slots.tab(), classNames?.tab)}
              onPress={() => handleTabPress(index)}
            >
              <Text
                className={cn(
                  slots.tabText(),
                  classNames?.tabText,
                  index === activeTab && 'font-semibold text-primary'
                )}
              >
                {picker.title}
              </Text>
              {index === activeTab ? (
                <View className={cn(slots.activeIndicator(), classNames?.activeIndicator)} />
              ) : null}
            </Pressable>
          ))}
        </View>
      ) : null}

      {/* Active Picker */}
      {pickers.map((picker, index) =>
        index === activeTab ? (
          <PickerView
            key={picker.key ?? index}
            columns={picker.columns}
            fieldNames={picker.fieldNames}
            haptic={picker.haptic}
            itemHeight={picker.itemHeight}
            loading={picker.loading}
            onChange={(values) => handlePickerChange(values, index)}
            showToolbar={false}
            value={allValues[index] ?? []}
            visibleCount={picker.visibleCount}
          />
        ) : null
      )}
    </View>
  );
};

export { PickerGroupView };
