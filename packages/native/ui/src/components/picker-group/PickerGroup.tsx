import { useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Sheet } from '../sheet/Sheet';
import { PickerGroupView } from './PickerGroupView';
import type { PickerGroupProps } from './types';

const PickerGroup = (props: PickerGroupProps) => {
  const {
    cancelText = 'Cancel',
    children,
    className,
    classNames,
    confirmText = 'Confirm',
    defaultValues,
    nextStepText = 'Next',
    onChange,
    onCancel,
    onConfirm,
    onTabChange,
    onUpdateShow,
    pickers,
    show,
    showTabBar = true,
    showToolbar = true,
    values: valuesProp
  } = props;

  const initialValuesRef = useRef(defaultValues ?? pickers.map(p => p.defaultValue ?? []));

  // Committed values — the confirmed selection
  const [committedValues, setCommittedValues] = useControllableState<string[][]>({
    caller: 'PickerGroup',
    defaultProp: initialValuesRef.current,
    prop: valuesProp
  });

  // Display values — temporary while the sheet is open
  const [displayValues, setDisplayValues] = useState<string[][]>(committedValues);

  // Active tab resets when sheet opens
  const [displayTab, setDisplayTab] = useState(0);

  // Sync display values and reset tab when sheet opens
  useEffect(() => {
    if (show) {
      setDisplayValues(committedValues);
      setDisplayTab(0);
    }
  }, [show]);

  function handleOpen() {
    onUpdateShow?.(true);
  }

  function handleDisplayChange(values: string[][], pickerIndex: number) {
    setDisplayValues(values);
    onChange?.(values, pickerIndex);
  }

  function handleConfirm(values: string[][]) {
    setCommittedValues(values);
    onConfirm?.(values);
    onUpdateShow?.(false);
  }

  function handleCancel(values: string[][]) {
    onCancel?.(values);
    onUpdateShow?.(false);
  }

  function handleTabChange(index: number) {
    setDisplayTab(index);
    onTabChange?.(index);
  }

  function renderTrigger() {
    if (!children) return null;

    if (typeof children === 'function') {
      return children({ open: handleOpen, values: committedValues });
    }

    return <Pressable onPress={handleOpen}>{children}</Pressable>;
  }

  return (
    <>
      {renderTrigger()}

      <Sheet
        closeable={false}
        show={show}
        showHandle={false}
        onUpdateShow={onUpdateShow}
      >
        <PickerGroupView
          activeTab={displayTab}
          cancelText={cancelText}
          className={className}
          classNames={classNames}
          confirmText={confirmText}
          nextStepText={nextStepText}
          onCancel={handleCancel}
          onChange={handleDisplayChange}
          onConfirm={handleConfirm}
          onTabChange={handleTabChange}
          pickers={pickers}
          showTabBar={showTabBar}
          showToolbar={showToolbar}
          values={displayValues}
        />
      </Sheet>
    </>
  );
};

export { PickerGroup };
