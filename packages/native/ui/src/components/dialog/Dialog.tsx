import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { useState } from 'react';
import { Keyboard, View } from 'react-native';
import { Input } from '../input/Input';
import { Popup } from '../popup/Popup';
import { Text } from '../text/Typography';
import { dialogVariants } from './dialog-variants';
import { DialogFooter } from './DialogFooter';
import type { DialogAction, DialogLoading, DialogProps } from './types';

/** 两个按钮都不处于 loading 的状态，异步 beforeClose 结束后一律回到这里 */
const IDLE_LOADING: DialogLoading = { cancel: false, confirm: false };

/** Thenable 判定：beforeClose 可能返回非原生 Promise，用 instanceof 会把它们当成同步结果 */
function isThenable(value: boolean | Promise<boolean>): value is Promise<boolean> {
  return typeof (value as Promise<boolean>).then === 'function';
}

/**
 * 对话框组件
 *
 * 声明式使用时不要把 `<Dialog />` 写在 ScrollView 里面：JS 触摸响应链走的是 React 树而不是原生视图树， Modal 渲染到哪儿都改变不了这一点。键盘弹起时 ScrollView 会在 capture
 * 阶段抢走第一次点击用于收键盘 （`keyboardShouldPersistTaps` 默认 `never`，见 ScrollView.js 的 `_handleStartShouldSetResponderCapture`），
 * 于是带输入框的对话框要点两下才关得掉。挂到 ScrollView 外层，或给该 ScrollView 传 `keyboardShouldPersistTaps="handled"`。命令式的 showDialog 走
 * Portal，不受影响。
 */
const Dialog = (props: DialogProps) => {
  const {
    avoidKeyboard,
    beforeClose,
    cancelButtonText = '取消',
    children,
    className,
    classNames,
    closeOnBackdropPress = false,
    closeOnBackPress = true,
    confirmButtonColor = 'primary',
    confirmButtonDisabled = false,
    confirmButtonText = '确定',
    defaultInputValue = '',
    inputPlaceholder,
    inputProps,
    inputValue: inputValueProp,
    message,
    messageAlign = 'center',
    onCancel,
    onClosed,
    onConfirm,
    onInputChange,
    onOpened,
    onUpdateShow,
    show,
    showCancelButton = false,
    showConfirmButton = true,
    showInput = false,
    theme = 'default',
    themeDirection = 'vertical',
    title
  } = props;

  const [loading, setLoading] = useState<DialogLoading>(IDLE_LOADING);

  const [inputValue, setInputValue] = useControllableState<string>({
    caller: 'dialog-input',
    defaultProp: defaultInputValue,
    onChange: onInputChange,
    prop: inputValueProp
  });

  const hasTitle = Boolean(title);
  const hasFooter = showCancelButton || showConfirmButton;
  // 带输入框时默认避让键盘：输入框被键盘挡住的对话框等于不能用
  const shouldAvoidKeyboard = avoidKeyboard ?? showInput;
  const variantSlots = dialogVariants({ hasTitle, messageAlign });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    // 优先级：变体样式 < slot 级覆盖（classNames）< 根级覆盖（className）
    return {
      body: cn(variantSlots.body(), classNames?.body),
      header: cn(variantSlots.header(), classNames?.header),
      message: cn(variantSlots.message(), classNames?.message),
      popup: cn(variantSlots.popup(), classNames?.popup),
      root: cn(variantSlots.root(), classNames?.root, className),
      title: cn(variantSlots.title(), classNames?.title)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function getInputValue() {
    return showInput ? inputValue : undefined;
  }

  function close(action: DialogAction) {
    const value = getInputValue();

    // 先回调动作、后回调可见性：命令式封装靠这个顺序区分「确定」与「被关闭」，
    // 顺序颠倒会让每一次确定都先被当成一次取消
    if (action === 'confirm') {
      onConfirm?.(value);
    } else {
      onCancel?.(value);
    }

    onUpdateShow?.(false);
  }

  function handleAction(action: DialogAction) {
    if (loading.cancel || loading.confirm) return;

    if (showInput) Keyboard.dismiss();

    if (!beforeClose) {
      close(action);
      return;
    }

    const result = beforeClose(action, getInputValue());

    // 同步结果不进 loading：setState 会在同一批次里被合并掉，写了也永远渲染不出来
    if (!isThenable(result)) {
      if (result) close(action);
      return;
    }

    setLoading(prev => ({ ...prev, [action]: true }));

    result
      .then(shouldClose => {
        setLoading(IDLE_LOADING);
        if (shouldClose) close(action);
      })
      .catch(() => {
        setLoading(IDLE_LOADING);
      });
  }

  function handleInputChange(text: string) {
    setInputValue(text);
  }

  function handleCancel() {
    handleAction('cancel');
  }

  function handleConfirm() {
    handleAction('confirm');
  }

  function handlePopupUpdateShow(next: boolean) {
    if (next) return;

    // 遮罩点击与返回键走和点「取消」完全相同的路径，否则这两条出口会绕过 beforeClose 与 onCancel
    handleAction('cancel');
  }

  return (
    <Popup
      avoidKeyboard={shouldAvoidKeyboard}
      className={slotClassNames.popup}
      closeOnBackdropPress={closeOnBackdropPress}
      closeOnBackPress={closeOnBackPress}
      position="center"
      show={show}
      surface={false}
      onClosed={onClosed}
      onOpened={onOpened}
      onUpdateShow={handlePopupUpdateShow}
    >
      <View className={slotClassNames.root}>
        {/* Header */}
        {hasTitle && (
          <View className={slotClassNames.header}>
            <Text className={slotClassNames.title}>{title}</Text>
          </View>
        )}

        {/* Body */}
        <View className={slotClassNames.body}>
          {message ? <Text className={slotClassNames.message}>{message}</Text> : null}
          {showInput && (
            <Input
              autoFocus
              placeholder={inputPlaceholder}
              size="md"
              {...inputProps}
              value={inputValue}
              onChangeText={handleInputChange}
            />
          )}
          {children}
        </View>

        {/* Footer */}
        {hasFooter && (
          <DialogFooter
            cancelButtonText={cancelButtonText}
            classNames={classNames}
            confirmButtonColor={confirmButtonColor}
            confirmButtonDisabled={confirmButtonDisabled}
            confirmButtonText={confirmButtonText}
            loading={loading}
            showCancelButton={showCancelButton}
            showConfirmButton={showConfirmButton}
            theme={theme}
            themeDirection={themeDirection}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
          />
        )}
      </View>
    </Popup>
  );
};

export { Dialog };
