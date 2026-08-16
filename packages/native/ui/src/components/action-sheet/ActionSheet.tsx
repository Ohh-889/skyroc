import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';
import { Divider } from '../divider/Divider';
import { Sheet } from '../sheet/Sheet';
import { Text } from '../text/Typography';
import { actionSheetVariants } from './action-sheet-variants';
import type { ActionSheetAction, ActionSheetProps } from './types';

/** 单个操作项合并后的类名，由 resolveActionSlotClassNames 逐行解析 */
interface ActionSlotClassNames {
  /** 操作项根节点 */
  action: string;
  /** 操作项名称 */
  actionName: string;
  /** 操作项描述 */
  actionSubname: string;
  /** 加载指示器取色用的 accent-* 类名 */
  indicator: string;
}

/** 字符串走 Text 承接主题字号与颜色；自定义节点原样渲染——RN 里把 View 塞进 Text 会挤坏布局 */
function renderTextNode(node: ReactNode, className: string, style?: StyleProp<TextStyle>) {
  if (typeof node === 'string' || typeof node === 'number') {
    return (
      <Text
        className={className}
        style={style}
      >
        {node}
      </Text>
    );
  }

  return node ?? null;
}

/** 操作面板组件 */
const ActionSheet = (props: ActionSheetProps) => {
  const {
    actions = [],
    cancelText,
    children,
    className,
    classNames,
    closeable = true,
    closeOnBackdropPress = true,
    closeOnClickAction = false,
    defaultShow = false,
    defaultValue = '',
    description,
    enablePanDownToClose = true,
    onCancel,
    onChange,
    onClosed,
    onSelect,
    onUpdateShow,
    ref,
    sheetClassName,
    sheetClassNames,
    show: showProp,
    showHandle = true,
    title,
    value: valueProp,
    variant = 'default'
  } = props;

  const [selectedValue, setSelectedValue] = useControllableState<string>({
    caller: 'ActionSheet',
    defaultProp: defaultValue,
    onChange,
    prop: valueProp
  });

  const [visible, setVisible] = useControllableState<boolean>({
    caller: 'ActionSheet-show',
    defaultProp: defaultShow,
    onChange: onUpdateShow,
    prop: showProp
  });

  const variantSlots = actionSheetVariants({ variant });
  const selectedAction = actions.find(action => action.value === selectedValue);

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  const slotClassNames = {
    cancel: cn(variantSlots.cancel(), classNames?.cancel),
    cancelGap: cn(variantSlots.cancelGap(), classNames?.cancelGap),
    cancelName: cn(variantSlots.cancelName(), classNames?.cancelName),
    root: cn(variantSlots.root(), classNames?.root, className)
  };

  /**
   * 操作项的类名只能逐行解析：选中 / 禁用 / 加载三态各不相同，没法像上面那样一次算完。
   *
   * 单个操作项的 className 排在 classNames.action 之后，行级覆盖优先于整体覆盖。
   */
  function resolveActionSlotClassNames(action: ActionSheetAction): ActionSlotClassNames {
    const itemSlots = actionSheetVariants({
      disabled: action.disabled,
      loading: action.loading,
      selected: selectedValue === action.value,
      variant
    });

    return {
      action: cn(itemSlots.action(), classNames?.action, action.className),
      actionName: cn(itemSlots.actionName(), classNames?.actionName),
      actionSubname: cn(itemSlots.actionSubname(), classNames?.actionSubname),
      indicator: cn(itemSlots.indicator(), classNames?.indicator)
    };
  }

  function handleToggle() {
    setVisible(!visible);
  }

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

  function handleSelect(action: ActionSheetAction, index: number) {
    if (action.disabled || action.loading) return;

    setSelectedValue(action.value);

    action.callback?.();
    onSelect?.(action, index);

    if (closeOnClickAction) {
      setVisible(false);
    }
  }

  function handleCancel() {
    onCancel?.();
    setVisible(false);
  }

  function renderAction(action: ActionSheetAction, index: number) {
    const actionSlotClassNames = resolveActionSlotClassNames(action);

    return (
      <View key={action.value}>
        {variant === 'default' && index > 0 && <Divider className="my-0" />}

        <Pressable
          className={actionSlotClassNames.action}
          disabled={action.disabled || action.loading}
          onPress={() => handleSelect(action, index)}
        >
          {action.loading ? (
            <ActivityIndicator
              colorClassName={actionSlotClassNames.indicator}
              size="small"
            />
          ) : (
            <>
              {variant === 'button' && action.icon}

              {/* 自定义色是显式指定，写进 style 后优先级高于选中态的 text-primary */}
              {renderTextNode(
                action.name,
                actionSlotClassNames.actionName,
                action.color ? { color: action.color } : undefined
              )}

              {action.subname ? renderTextNode(action.subname, actionSlotClassNames.actionSubname) : null}
            </>
          )}
        </Pressable>
      </View>
    );
  }

  function renderCancel() {
    if (!cancelText) return null;

    return (
      <>
        {/* 与操作列表之间的灰色间隔只属于 default 变体：button 变体本身就是靠 root 的 gap 分隔卡片的 */}
        {variant === 'default' && <View className={slotClassNames.cancelGap} />}

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
    <>
      {children?.({ action: selectedAction, toggle: handleToggle, value: selectedValue })}

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
          {actions.map(renderAction)}

          {renderCancel()}
        </BottomSheetView>
      </Sheet>
    </>
  );
};

export { ActionSheet };
