import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Sheet } from '../sheet/Sheet';
import { PickerView } from './PickerView';
import type { PickerProps } from './types';

const Picker = (props: PickerProps) => {
  const {
    cancelText = '取消',
    children,
    className,
    classNames,
    closeOnBackdropPress = true,
    columns,
    confirmText = '确定',
    defaultValue = [],
    enablePanDownToClose,
    fieldNames,
    itemHeight,
    loading,
    onChange,
    onCancel,
    onConfirm,
    onUpdateShow,
    show,
    showToolbar = true,
    title,
    value: valueProp,
    visibleCount
  } = props;

  // Committed value — the confirmed selection
  const [committedValue, setCommittedValue] = useControllableState({
    caller: 'Picker',
    defaultProp: defaultValue,
    onChange,
    prop: valueProp
  });

  // Display value — temporary while the sheet is open
  const [displayValue, setDisplayValue] = useState<string[]>(committedValue);

  // Sync display value when sheet opens
  useEffect(() => {
    if (show) {
      setDisplayValue(committedValue);
    }
  }, [show]);

  function handleOpen() {
    onUpdateShow?.(true);
  }

  function handleDisplayChange(values: string[]) {
    setDisplayValue(values);
  }

  function handleConfirm(values: string[]) {
    setCommittedValue(values);
    onConfirm?.(values);
    onUpdateShow?.(false);
  }

  function handleCancel(values: string[]) {
    onCancel?.(values);
    onUpdateShow?.(false);
  }

  function renderTrigger() {
    if (!children) return null;

    if (typeof children === 'function') {
      return children({ open: handleOpen, value: committedValue });
    }

    return <Pressable onPress={handleOpen}>{children}</Pressable>;
  }

  return (
    <>
      {renderTrigger()}

      <Sheet
        closeable={false}
        closeOnBackdropPress={closeOnBackdropPress}
        enablePanDownToClose={enablePanDownToClose}
        show={show}
        showHandle={false}
        onUpdateShow={onUpdateShow}
      >
        <PickerView
          cancelText={cancelText}
          className={className}
          classNames={classNames}
          columns={columns}
          confirmText={confirmText}
          fieldNames={fieldNames}
          itemHeight={itemHeight}
          loading={loading}
          onCancel={handleCancel}
          onChange={handleDisplayChange}
          onConfirm={handleConfirm}
          showToolbar={showToolbar}
          title={title}
          value={displayValue}
          visibleCount={visibleCount}
        />
      </Sheet>
    </>
  );
};

export { Picker };
