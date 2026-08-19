import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { DEFAULT_ITEM_HEIGHT, DEFAULT_VISIBLE_COUNT, pickerVariants } from './picker-variants';
import { PickerColumn } from './PickerColumn';
import { PickerToolbar } from './PickerToolbar';
import type { PickerViewProps } from './types';
import { assignDefaultFieldNames, resolveColumns } from './utils';

/** 内联选择器，不带弹层 */
const PickerView = (props: PickerViewProps) => {
  const {
    cancelText = '取消',
    className,
    classNames,
    columns,
    confirmText = '确定',
    defaultValue = [],
    fieldNames: fieldNamesProp,
    haptic = false,
    itemHeight = DEFAULT_ITEM_HEIGHT,
    loading = false,
    onCancel,
    onChange,
    onConfirm,
    showToolbar = true,
    title,
    value: valueProp,
    visibleCount = DEFAULT_VISIBLE_COUNT
  } = props;

  const [value, setValue] = useControllableState({
    caller: 'PickerView',
    defaultProp: defaultValue,
    onChange,
    prop: valueProp
  });

  const mergedFieldNames = useMemo(() => assignDefaultFieldNames(fieldNamesProp), [fieldNamesProp]);

  // 列的展开与选中值的修正互相依赖，交给 resolveColumns 一次算到不动点
  const { columns: normalizedColumns, values: validValues } = useMemo(
    () => resolveColumns(columns, mergedFieldNames, value),
    [columns, mergedFieldNames, value]
  );

  const slots = pickerVariants();
  const indicatorTop = Math.floor(visibleCount / 2) * itemHeight;

  const slotClassNames = {
    columns: cn(slots.columns(), classNames?.columns),
    loading: cn(slots.loading(), classNames?.loading),
    root: cn(slots.root(), classNames?.root, className),
    selectedIndicator: cn(slots.selectedIndicator(), classNames?.selectedIndicator)
  };

  function handleColumnChange(columnValue: string, columnIndex: number) {
    const nextValues = [...validValues];
    nextValues[columnIndex] = columnValue;

    // 级联下改上一级会换掉下一级的整份数据，必须重新解一次，不能只把新值塞回去
    setValue(resolveColumns(columns, mergedFieldNames, nextValues).values);
  }

  function handleConfirm() {
    onConfirm?.(validValues);
  }

  function handleCancel() {
    onCancel?.(validValues);
  }

  return (
    <View className={slotClassNames.root}>
      {showToolbar ? (
        <PickerToolbar
          cancelText={cancelText}
          classNames={classNames}
          confirmText={confirmText}
          title={title}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      ) : null}

      <View
        className={slotClassNames.columns}
        style={{ height: visibleCount * itemHeight }}
      >
        {/* 选中指示线画在滚轮下方，pointerEvents 关掉，免得绝对定位层截走滚动手势 */}
        <View
          className={slotClassNames.selectedIndicator}
          style={{ height: itemHeight, pointerEvents: 'none', top: indicatorTop }}
        />

        {normalizedColumns.map((columnOptions, index) => (
          // 列的身份就是它的位置：级联换级时同一位置的列换掉整份数据，由 PickerColumn 内的
          // value / options 同步 effect 负责重新定位，不需要靠 key 重建
          <PickerColumn
            key={index}
            classNames={classNames}
            columnIndex={index}
            fieldNames={mergedFieldNames}
            haptic={haptic}
            itemHeight={itemHeight}
            options={columnOptions}
            value={validValues[index] ?? ''}
            visibleCount={visibleCount}
            onChange={handleColumnChange}
          />
        ))}

        {loading ? (
          <View className={slotClassNames.loading}>
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
