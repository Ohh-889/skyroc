import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider } from '../divider/Divider';
import { Sheet } from '../sheet/Sheet';
import { Text } from '../text/Typography';
import { shareSheetVariants } from './share-sheet-variants';
import type { ShareSheetOption, ShareSheetOptions, ShareSheetProps } from './types';

/** 字符串走 Text 承接主题字号与颜色；自定义节点原样渲染——RN 里把 View 塞进 Text 会挤坏布局 */
function renderTextNode(node: ReactNode, className: string) {
  if (typeof node === 'string' || typeof node === 'number') {
    return <Text className={className}>{node}</Text>;
  }

  return node ?? null;
}

/** 二维即多行；空列表两种写法看不出区别，按单行处理即可 */
function isMultiRow(options: ShareSheetOptions): options is ShareSheetOption[][] {
  return Array.isArray(options[0]);
}

/** 单行统一升成一行的二维结构：渲染逻辑只留一套，行下标也能一路带到 onSelect */
function toRows(options: ShareSheetOptions): ShareSheetOption[][] {
  return isMultiRow(options) ? options : [options];
}

/** 分享面板组件 */
const ShareSheet = (props: ShareSheetProps) => {
  const {
    cancelText,
    className,
    classNames,
    closeable = true,
    closeOnBackdropPress = true,
    closeOnSelect = false,
    defaultShow = false,
    description,
    enablePanDownToClose = true,
    onCancel,
    onClosed,
    onSelect,
    onUpdateShow,
    options = [],
    ref,
    sheetClassName,
    sheetClassNames,
    show: showProp,
    showHandle = true,
    title
  } = props;

  const [visible, setVisible] = useControllableState<boolean>({
    caller: 'ShareSheet',
    defaultProp: defaultShow,
    onChange: onUpdateShow,
    prop: showProp
  });

  const variantSlots = shareSheetVariants();
  const rows = toRows(options);

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  const slotClassNames = {
    cancel: cn(variantSlots.cancel(), classNames?.cancel),
    cancelGap: cn(variantSlots.cancelGap(), classNames?.cancelGap),
    cancelName: cn(variantSlots.cancelName(), classNames?.cancelName),
    option: cn(variantSlots.option(), classNames?.option),
    optionDescription: cn(variantSlots.optionDescription(), classNames?.optionDescription),
    optionIcon: cn(variantSlots.optionIcon(), classNames?.optionIcon),
    optionName: cn(variantSlots.optionName(), classNames?.optionName),
    options: cn(variantSlots.options(), classNames?.options),
    root: cn(variantSlots.root(), classNames?.root, className),
    row: cn(variantSlots.row(), classNames?.row)
  };

  /**
   * Sheet 的 onUpdateShow 由 gorhom 的 onDismiss 触发，此时退场动画已经播完。
   *
   * 所以这里既要同步 visible（非受控模式下自己收尾），也是唯一能确定「已经关干净了」的时机， onClosed 只从这里发出去。
   */
  function handleSheetUpdate(show: boolean) {
    setVisible(show);

    if (!show) {
      onClosed?.();
    }
  }

  function handleSelect(option: ShareSheetOption, index: number, rowIndex: number) {
    onSelect?.(option, index, rowIndex);

    if (closeOnSelect) {
      setVisible(false);
    }
  }

  function handleCancel() {
    onCancel?.();
    setVisible(false);
  }

  function renderOption(option: ShareSheetOption, index: number, rowIndex: number) {
    return (
      <Pressable
        key={option.value}
        className={cn(slotClassNames.option, option.className)}
        onPress={() => handleSelect(option, index, rowIndex)}
      >
        {option.icon ? <View className={slotClassNames.optionIcon}>{option.icon}</View> : null}

        {renderTextNode(option.name, slotClassNames.optionName)}

        {option.description ? renderTextNode(option.description, slotClassNames.optionDescription) : null}
      </Pressable>
    );
  }

  function renderRow(row: ShareSheetOption[], rowIndex: number) {
    return (
      <View
        key={rowIndex}
        className={slotClassNames.row}
      >
        {rowIndex > 0 && <Divider className="my-0" />}

        {/*
          横滑容器不能换成 BottomSheetScrollView：那个组件会把自己注册成面板唯一的滚动容器，
          多行就会互相顶掉，还会让下拉关闭去联动一条横向列表。RNGH 的 ScrollView 与 gorhom
          同属一套手势体系，横滑与面板下拉各自识别，才是这里该用的。
        */}
        <ScrollView
          horizontal
          contentContainerClassName={slotClassNames.options}
          showsHorizontalScrollIndicator={false}
        >
          {row.map((option, index) => renderOption(option, index, rowIndex))}
        </ScrollView>
      </View>
    );
  }

  function renderCancel() {
    if (!cancelText) return null;

    return (
      <>
        <View className={slotClassNames.cancelGap} />

        <Pressable
          className={slotClassNames.cancel}
          onPress={handleCancel}
        >
          <Text className={slotClassNames.cancelName}>{cancelText}</Text>
        </Pressable>
      </>
    );
  }

  return (
    <Sheet
      ref={ref}
      className={sheetClassName}
      classNames={sheetClassNames}
      closeable={closeable}
      closeOnBackdropPress={closeOnBackdropPress}
      description={description}
      enablePanDownToClose={enablePanDownToClose}
      show={visible}
      showHandle={showHandle}
      title={title}
      onUpdateShow={handleSheetUpdate}
    >
      {/* Sheet 的内容容器必须是 gorhom 的组件，否则动态档位量不到内容高度，面板撑不开 */}
      <BottomSheetView className={slotClassNames.root}>
        {rows.map(renderRow)}

        {renderCancel()}
      </BottomSheetView>
    </Sheet>
  );
};

export { ShareSheet };
