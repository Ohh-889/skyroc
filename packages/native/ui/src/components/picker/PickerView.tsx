import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { cn } from '@skyroc/utils';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { PickerColumn } from './PickerColumn';
import { PickerToolbar } from './PickerToolbar';
import { DEFAULT_ITEM_HEIGHT, DEFAULT_VISIBLE_COUNT, pickerVariants } from './picker-variants';
import type { PickerViewProps } from './types';
import { assignDefaultFieldNames, ensureSelectedValues, normalizeColumns } from './utils';

const PickerView = (props: PickerViewProps) => {
  const {
    cancelText = 'Cancel',
    className,
    classNames,
    columns,
    confirmText = 'Confirm',
    defaultValue = [],
    fieldNames: fieldNamesProp,
    itemHeight = DEFAULT_ITEM_HEIGHT,
    loading = false,
    haptic = false,
    onChange,
    onCancel,
    onConfirm,
    showToolbar = true,
    title,
    value: valueProp,
    visibleCount = DEFAULT_VISIBLE_COUNT
  } = props;

  const mergedFieldNames = useMemo(() => assignDefaultFieldNames(fieldNamesProp), [fieldNamesProp]);

  const [value, setValue] = useControllableState({
    caller: 'PickerView',
    defaultProp: defaultValue,
    onChange,
    prop: valueProp
  });

  // Normalize columns into a 2D array
  const normalizedColumns = useMemo(
    () => normalizeColumns(columns, mergedFieldNames, value),
    [columns, mergedFieldNames, value]
  );

  // Ensure all selected values are valid
  const validValues = useMemo(
    () => ensureSelectedValues(normalizedColumns, value, mergedFieldNames),
    [normalizedColumns, value, mergedFieldNames]
  );

  const slots = pickerVariants();
  const indicatorTop = Math.floor(visibleCount / 2) * itemHeight;

  function handleColumnChange(columnValue: string, columnIndex: number) {
    const newValues = [...validValues];
    newValues[columnIndex] = columnValue;

    // For cascade: re-normalize and ensure child values
    const newNormalized = normalizeColumns(columns, mergedFieldNames, newValues);
    const ensured = ensureSelectedValues(newNormalized, newValues, mergedFieldNames);

    setValue(ensured);
  }

  function handleConfirm() {
    onConfirm?.(validValues);
  }

  function handleCancel() {
    onCancel?.(validValues);
  }

  return (
    <View className={cn(slots.root(), className)}>
      {showToolbar ? (
        <PickerToolbar
          cancelText={cancelText}
          classNames={classNames}
          confirmText={confirmText}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
          title={title}
        />
      ) : null}

      <View
        style={{ height: visibleCount * itemHeight, position: 'relative', overflow: 'hidden', flexDirection: 'row' }}
      >
        {/* Selected indicator line */}
        <View
          style={{
            height: itemHeight,
            top: indicatorTop,
            position: 'absolute',
            left: 0,
            right: 0,
            width: '100%',
            borderTopWidth: StyleSheet.hairlineWidth,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: '#e5e7eb'
          }}
        />

        {normalizedColumns.map((columnOptions, index) => (
          <PickerColumn
            key={index}
            columnIndex={index}
            fieldNames={mergedFieldNames}
            haptic={haptic}
            itemHeight={itemHeight}
            onChange={handleColumnChange}
            options={columnOptions}
            value={validValues[index] ?? ''}
            visibleCount={visibleCount}
          />
        ))}

        {loading ? (
          <View className={cn(slots.loading(), classNames?.loading)}>
            <ActivityIndicator
              className="text-muted-foreground"
              size="large"
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export { PickerView };
