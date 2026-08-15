/* eslint-disable complexity */
import { useState } from 'react';
import { Keyboard, View } from 'react-native';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { Button } from '../button/Button';
import { Divider } from '../divider/Divider';
import { Input } from '../input/Input';
import { Text } from '../text/Typography';
import { Popup } from '../popup/Popup';
import type { DialogAction, DialogProps } from './types';
import { dialogVariants } from './dialog-variants';

/** 对话框组件 */
const Dialog = (props: DialogProps) => {
  const {
    avoidKeyboard = false,
    beforeClose,
    cancelButtonText = '取消',
    children,
    className,
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
    onConfirm,
    onInputChange,
    onUpdateShow,
    popupClassName,
    show,
    showCancelButton = false,
    showConfirmButton = true,
    showInput = false,
    theme = 'default',
    themeDirection = 'vertical',
    title
  } = props;

  const [loading, setLoading] = useState<{ cancel: boolean; confirm: boolean }>({
    cancel: false,
    confirm: false
  });

  const [inputValue, setInputValue] = useControllableState<string>({
    caller: 'dialog-input',
    defaultProp: defaultInputValue,
    onChange: onInputChange,
    prop: inputValueProp
  });

  const hasTitle = Boolean(title);
  const slots = dialogVariants({ messageAlign, hasTitle, theme });
  const hasFooter = showCancelButton || showConfirmButton;
  const isRoundButton = theme === 'round-button';

  const isHorizontal = themeDirection === 'horizontal';

  const roundHorizontal = isRoundButton && isHorizontal;

  function handleInputChange(text: string) {
    setInputValue(text);
  }

  function getInputValue() {
    return showInput ? inputValue : undefined;
  }

  function handleAction(action: DialogAction) {
    if (loading.cancel || loading.confirm) return;

    if (showInput) Keyboard.dismiss();

    if (beforeClose) {
      setLoading(prev => ({ ...prev, [action]: true }));

      const result = beforeClose(action, getInputValue());

      if (result instanceof Promise) {
        result
          .then(shouldClose => {
            setLoading({ cancel: false, confirm: false });
            if (shouldClose) {
              close(action);
            }
          })
          .catch(() => {
            setLoading({ cancel: false, confirm: false });
          });
      } else {
        setLoading({ cancel: false, confirm: false });
        if (result) {
          close(action);
        }
      }
    } else {
      close(action);
    }
  }

  function close(action: DialogAction) {
    onUpdateShow?.(false);
    const val = getInputValue();
    if (action === 'confirm') {
      onConfirm?.(val);
    } else {
      onCancel?.(val);
    }
  }

  function handleCancel() {
    handleAction('cancel');
  }

  function handleConfirm() {
    handleAction('confirm');
  }

  const defaultFooter = (
    <>
      <Divider className="my-0" />
      <View className={slots.footer()}>
        {showCancelButton && (
          <Button
            className={slots.cancelButton()}
            color="muted"
            disabled={loading.confirm}
            loading={loading.cancel}
            shape="rounded"
            size="lg"
            variant="ghost"
            onPress={handleCancel}
          >
            {cancelButtonText}
          </Button>
        )}
        {showCancelButton && showConfirmButton && (
          <Divider
            className="mx-0"
            orientation="vertical"
          />
        )}
        {showConfirmButton && (
          <Button
            className={slots.confirmButton()}
            color={confirmButtonColor}
            disabled={loading.cancel || confirmButtonDisabled}
            loading={loading.confirm}
            shape="rounded"
            size="lg"
            variant="ghost"
            onPress={handleConfirm}
          >
            {confirmButtonText}
          </Button>
        )}
      </View>
    </>
  );

  const directionClass = isHorizontal ? 'flex-row' : 'flex-col';

  const roundButtonFooter = (
    <View className={cn(slots.footer(), directionClass)}>
      {showConfirmButton && (
        <Button
          color={confirmButtonColor}
          loading={loading.confirm}
          disabled={loading.cancel || confirmButtonDisabled}
          shape="pill"
          className={roundHorizontal ? 'flex-1' : 'w-full'}
          onPress={handleConfirm}
        >
          {confirmButtonText}
        </Button>
      )}
      {showCancelButton && (
        <Button
          color="secondary"
          loading={loading.cancel}
          disabled={loading.confirm}
          shape="pill"
          className={roundHorizontal ? 'flex-1' : 'w-full'}
          variant="outline"
          onPress={handleCancel}
        >
          {cancelButtonText}
        </Button>
      )}
    </View>
  );

  return (
    <Popup
      avoidKeyboard={avoidKeyboard}
      closeOnBackdropPress={false}
      position="center"
      className={cn('w-[80%]', popupClassName)}
      show={show}
      onUpdateShow={onUpdateShow}
    >
      <View className={cn(slots.root(), className)}>
        {/* Header */}
        {hasTitle && (
          <View className={slots.header()}>
            <Text className={slots.title()}>{title}</Text>
          </View>
        )}

        {/* Body */}
        <View className={slots.body()}>
          {message ? <Text className={slots.message()}>{message}</Text> : null}
          {showInput && (
            <Input
              placeholder={inputPlaceholder}
              value={inputValue}
              onChangeText={handleInputChange}
              autoFocus
              size="md"
              {...inputProps}
            />
          )}
          {children}
        </View>

        {/* Footer */}
        {hasFooter && (isRoundButton ? roundButtonFooter : defaultFooter)}
      </View>
    </Popup>
  );
};

export { Dialog };
