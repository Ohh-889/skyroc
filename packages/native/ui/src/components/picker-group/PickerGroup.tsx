/* eslint-disable react-hooks/exhaustive-deps -- 每次打开面板都要拿当时的已确认值做一次快照，
   把 committedValues 列进依赖会让面板开着的时候被外部改值覆盖掉用户正在滚的选择。 */
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { Sheet } from '../sheet/Sheet';
import { PickerGroupView } from './PickerGroupView';
import type { PickerGroupProps } from './types';

/** 弹层分组选择器，把 PickerGroupView 装进底部面板 */
const PickerGroup = (props: PickerGroupProps) => {
  const {
    cancelText,
    children,
    className,
    classNames,
    closeOnBackdropPress = true,
    confirmText,
    defaultValues,
    enablePanDownToClose = false,
    nextStepText,
    onCancel,
    onChange,
    onConfirm,
    onTabChange,
    onUpdateShow,
    pickers,
    ref,
    sheetClassName,
    sheetClassNames,
    show,
    showHandle = false,
    showTabBar = true,
    showToolbar = true,
    values: valuesProp
  } = props;

  // 已确认的值：只有在最后一个 tab 点「确定」才会写进来。
  // defaultProp 只在挂载时被读一次，这里每次渲染重算不会影响已有选中值。
  // 这里不接 onChange：onChange 是滚动即触发的实时回调，签名还多一个 pickerIndex，
  // 受控调用方要拿提交后的值请用 onConfirm
  const [committedValues, setCommittedValues] = useControllableState<string[][]>({
    caller: 'PickerGroup',
    defaultProp: defaultValues ?? pickers.map(picker => picker.defaultValue ?? []),
    prop: valuesProp
  });

  // 面板打开期间的临时值，取消就丢弃
  const [displayValues, setDisplayValues] = useState<string[][]>(committedValues);

  // 面板每次打开都从第一个 tab 开始，所以 tab 也是临时态
  const [displayTab, setDisplayTab] = useState(0);

  function handleUpdateShow(nextShow: boolean) {
    onUpdateShow?.(nextShow);
  }

  function handleOpen() {
    handleUpdateShow(true);
  }

  function handleDisplayChange(values: string[][], pickerIndex: number) {
    setDisplayValues(values);
    onChange?.(values, pickerIndex);
  }

  function handleConfirm(values: string[][]) {
    setCommittedValues(values);
    onConfirm?.(values);
    handleUpdateShow(false);
  }

  function handleCancel(values: string[][]) {
    onCancel?.(values);
    handleUpdateShow(false);
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

  // 每次打开时把临时值重置回已确认值、tab 拨回第一个，上一次取消掉的滚动与切换不会残留
  useEffect(() => {
    if (show) {
      setDisplayValues(committedValues);
      setDisplayTab(0);
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
          <PickerGroupView
            activeTab={displayTab}
            cancelText={cancelText}
            className={className}
            classNames={classNames}
            confirmText={confirmText}
            nextStepText={nextStepText}
            pickers={pickers}
            showTabBar={showTabBar}
            showToolbar={showToolbar}
            values={displayValues}
            onCancel={handleCancel}
            onChange={handleDisplayChange}
            onConfirm={handleConfirm}
            onTabChange={handleTabChange}
          />
        </BottomSheetView>
      </Sheet>
    </>
  );
};

export { PickerGroup };
