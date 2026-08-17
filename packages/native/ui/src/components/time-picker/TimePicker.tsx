/* eslint-disable react-hooks/exhaustive-deps -- 每次打开面板都要拿当时的已确认值做一次快照，
   把 committedValue 列进依赖会让面板开着的时候被外部改值覆盖掉用户正在滚的选择。 */
import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Sheet } from '../sheet/Sheet';
import { TimePickerView } from './TimePickerView';
import type { TimePickerProps } from './types';
import { DEFAULT_COLUMNS_TYPE, resolveInitialValue } from './utils';

/** 弹层时间选择器，把 TimePickerView 装进底部面板 */
const TimePicker = (props: TimePickerProps) => {
  const {
    cancelText,
    children,
    className,
    classNames,
    closeOnBackdropPress = true,
    columnsType = DEFAULT_COLUMNS_TYPE,
    confirmText,
    defaultValue,
    enablePanDownToClose = false,
    filter,
    formatter,
    haptic,
    itemHeight,
    loading,
    maxTime,
    minTime,
    onCancel,
    onChange,
    onConfirm,
    onUpdateShow,
    ref,
    sheetClassName,
    sheetClassNames,
    show,
    showHandle = false,
    showToolbar = true,
    title,
    value: valueProp,
    visibleCount
  } = props;

  // 已确认的值：只有点「确定」才会写进来。
  // defaultProp 只在挂载时被读一次，这里每次渲染重算不会影响已有选中值。
  // 初值同样要过一遍钳位：面板还没打开过时 children 拿到的就是它，越界值会直接显示在触发元素上
  const [committedValue, setCommittedValue] = useControllableState({
    caller: 'TimePicker',
    defaultProp: resolveInitialValue({ columnsType, filter, formatter, maxTime, minTime }, defaultValue),
    onChange,
    prop: valueProp
  });

  // 面板打开期间的临时值，取消就丢弃
  const [displayValue, setDisplayValue] = useState<string[]>(committedValue);

  function handleUpdateShow(nextShow: boolean) {
    onUpdateShow?.(nextShow);
  }

  function handleOpen() {
    handleUpdateShow(true);
  }

  function handleDisplayChange(values: string[]) {
    setDisplayValue(values);
  }

  function handleConfirm(values: string[]) {
    setCommittedValue(values);
    onConfirm?.(values);
    handleUpdateShow(false);
  }

  function handleCancel(values: string[]) {
    onCancel?.(values);
    handleUpdateShow(false);
  }

  function renderTrigger() {
    if (!children) return null;

    if (typeof children === 'function') {
      return children({ open: handleOpen, value: committedValue });
    }

    return <Pressable onPress={handleOpen}>{children}</Pressable>;
  }

  // 每次打开时把临时值重置回已确认值，上一次取消掉的滚动不会残留
  useEffect(() => {
    if (show) {
      setDisplayValue(committedValue);
    }
  }, [show]);

  return (
    <>
      {renderTrigger()}

      <Sheet
        ref={ref}
        className={sheetClassName}
        classNames={sheetClassNames}
        closeable={false}
        closeOnBackdropPress={closeOnBackdropPress}
        // 滚轮要独占垂直手势：面板的内容拖拽开着时，在列上下拉会拖动整个面板而不是滚动滚轮
        enableContentPanningGesture={false}
        enablePanDownToClose={enablePanDownToClose}
        show={show}
        showHandle={showHandle}
        onUpdateShow={handleUpdateShow}
      >
        {/* Sheet 不代为包裹容器：动态高度要靠 BottomSheetView 上报内容高度才量得出来 */}
        <BottomSheetView>
          <TimePickerView
            cancelText={cancelText}
            className={className}
            classNames={classNames}
            columnsType={columnsType}
            confirmText={confirmText}
            filter={filter}
            formatter={formatter}
            haptic={haptic}
            itemHeight={itemHeight}
            loading={loading}
            maxTime={maxTime}
            minTime={minTime}
            showToolbar={showToolbar}
            title={title}
            value={displayValue}
            visibleCount={visibleCount}
            onCancel={handleCancel}
            onChange={handleDisplayChange}
            onConfirm={handleConfirm}
          />
        </BottomSheetView>
      </Sheet>
    </>
  );
};

export { TimePicker };
