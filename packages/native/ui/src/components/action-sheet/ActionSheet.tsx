import { ActivityIndicator, Pressable, View } from 'react-native';
import { cn } from '@skyroc/utils';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Text } from '../text/Typography';
import { Divider } from '../divider/Divider';
import { Sheet } from '../sheet/Sheet';
import { actionSheetVariants } from './action-sheet-variants';
import type { ActionSheetAction, ActionSheetProps } from './types';

/** 操作面板组件 */
const ActionSheet = (props: ActionSheetProps) => {
  const {
    actions = [],
    cancelText,
    children,
    className,
    classNames,
    closeable = true,
    closeOnClickAction = false,
    defaultShow = false,
    defaultValue = '',
    description,
    onCancel,
    onChange,
    onSelect,
    onUpdateShow,
    sheetClassName,
    sheetClassNames,
    show: showProp,
    title,
    value: valueProp,
    variant = 'default'
  } = props;

  const [selectedValue, setSelectedValue] = useControllableState<string>({
    caller: 'action-sheet',
    defaultProp: defaultValue,
    onChange,
    prop: valueProp
  });

  const [visible, setVisible] = useControllableState<boolean>({
    caller: 'action-sheet-show',
    defaultProp: defaultShow,
    onChange: onUpdateShow,
    prop: showProp
  });

  const isButtonVariant = variant === 'button';
  const slots = actionSheetVariants({ variant });

  /** 根据当前选中值找到对应 action 的显示文本 */
  function getExtra(): string {
    if (!selectedValue) return '';
    const found = actions.find(a => a.value === selectedValue);
    if (!found) return '';
    if (found.label) return found.label;
    return typeof found.name === 'string' ? found.name : '';
  }

  function handleToggle() {
    setVisible(!visible);
  }

  function handleSheetUpdate(show: boolean) {
    setVisible(show);
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

  function renderName(
    action: ActionSheetAction,
    isSelected: boolean,
    itemSlots: ReturnType<typeof actionSheetVariants>
  ) {
    if (typeof action.name !== 'string') return action.name;
    return (
      <Text className={cn(itemSlots.actionName(), classNames?.actionName)}>
        <Text style={{ color: isSelected ? undefined : action.color }}>{action.name}</Text>
      </Text>
    );
  }

  function renderSubname(action: ActionSheetAction) {
    if (!action.subname) return null;
    if (typeof action.subname !== 'string') return action.subname;
    return <Text className={cn(slots.actionSubname(), classNames?.actionSubname)}>{action.subname}</Text>;
  }

  function renderAction(action: ActionSheetAction, index: number) {
    const isSelected = selectedValue === action.value;

    const itemSlots = actionSheetVariants({
      disabled: action.disabled,
      loading: action.loading,
      selected: isSelected,
      variant
    });

    return (
      <View key={index}>
        {variant === 'default' && index > 0 && <Divider className="my-0" />}
        <Pressable
          className={cn(itemSlots.action(), action.className, classNames?.action)}
          disabled={action.disabled || action.loading}
          onPress={() => handleSelect(action, index)}
        >
          {action.loading ? (
            <ActivityIndicator
              className="text-muted-foreground"
              size="small"
            />
          ) : (
            <>
              {isButtonVariant && action.icon}
              {renderName(action, isSelected, itemSlots)}
              {renderSubname(action)}
            </>
          )}
        </Pressable>
      </View>
    );
  }

  return (
    <>
      {children?.({ extra: getExtra(), toggle: handleToggle, value: selectedValue })}

      <Sheet
        className={sheetClassName}
        classNames={sheetClassNames}
        closeable={closeable}
        description={description}
        show={Boolean(visible)}
        title={title}
        onUpdateShow={handleSheetUpdate}
      >
        <View className={cn(slots.root(), className)}>
          {actions.map((action, index) => renderAction(action, index))}

          {cancelText ? (
            <>
              <View className={cn(slots.cancelGap(), classNames?.cancelGap)} />
              <Pressable
                className={cn(slots.cancel(), classNames?.cancel)}
                onPress={handleCancel}
              >
                <Text className="text-base text-foreground">{cancelText}</Text>
              </Pressable>
            </>
          ) : null}
        </View>
      </Sheet>
    </>
  );
};

export { ActionSheet };
