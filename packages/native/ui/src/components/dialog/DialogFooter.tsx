import { cn } from '@skyroc/utils';
import { View } from 'react-native';
import { Button } from '../button/Button';
import { Divider } from '../divider/Divider';
import { dialogFooterVariants } from './dialog-variants';
import type { DialogFooterProps, DialogTheme, DialogThemeDirection } from './types';

/** 变体槽与调用方覆盖类合并成最终类名，两套主题共用，避免各写一遍 cn */
function resolveSlotClassNames(props: DialogFooterProps, theme: DialogTheme, direction: DialogThemeDirection) {
  const { classNames } = props;
  const variantSlots = dialogFooterVariants({ direction, theme });

  // 优先级：变体样式 < slot 级覆盖（classNames）
  return {
    cancelButton: cn(variantSlots.button(), classNames?.cancelButton),
    confirmButton: cn(variantSlots.button(), classNames?.confirmButton),
    root: cn(variantSlots.root(), classNames?.footer)
  };
}

/** Default 主题：通栏文字按钮，与内容区之间以及两个按钮之间都由分割线隔开 */
const DefaultFooter = (props: DialogFooterProps) => {
  const {
    cancelButtonText,
    confirmButtonColor,
    confirmButtonDisabled,
    confirmButtonText,
    loading,
    onCancel,
    onConfirm,
    showCancelButton,
    showConfirmButton
  } = props;

  const slotClassNames = resolveSlotClassNames(props, 'default', 'horizontal');

  return (
    <>
      <Divider className="my-0" />
      <View className={slotClassNames.root}>
        {showCancelButton && (
          <Button
            className={slotClassNames.cancelButton}
            color="muted"
            disabled={loading.confirm}
            loading={loading.cancel}
            variant="ghost"
            onPress={onCancel}
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
            className={slotClassNames.confirmButton}
            color={confirmButtonColor}
            disabled={loading.cancel || confirmButtonDisabled}
            loading={loading.confirm}
            textClassName="font-semibold"
            variant="ghost"
            onPress={onConfirm}
          >
            {confirmButtonText}
          </Button>
        )}
      </View>
    </>
  );
};

/** Round-button 主题：胶囊按钮，排列方向由 themeDirection 决定 */
const RoundButtonFooter = (props: DialogFooterProps) => {
  const {
    cancelButtonText,
    confirmButtonColor,
    confirmButtonDisabled,
    confirmButtonText,
    loading,
    onCancel,
    onConfirm,
    showCancelButton,
    showConfirmButton,
    themeDirection
  } = props;

  const slotClassNames = resolveSlotClassNames(props, 'round-button', themeDirection);

  return (
    <View className={slotClassNames.root}>
      {showCancelButton && (
        <Button
          className={slotClassNames.cancelButton}
          color="secondary"
          disabled={loading.confirm}
          loading={loading.cancel}
          shape="pill"
          variant="outline"
          onPress={onCancel}
        >
          {cancelButtonText}
        </Button>
      )}
      {showConfirmButton && (
        <Button
          className={slotClassNames.confirmButton}
          color={confirmButtonColor}
          disabled={loading.cancel || confirmButtonDisabled}
          loading={loading.confirm}
          shape="pill"
          onPress={onConfirm}
        >
          {confirmButtonText}
        </Button>
      )}
    </View>
  );
};

/** Dialog 底部操作区，按 theme 分派到两套形态完全不同的实现 */
const DialogFooter = (props: DialogFooterProps) => {
  const { theme } = props;

  if (theme === 'round-button') {
    return <RoundButtonFooter {...props} />;
  }

  return <DefaultFooter {...props} />;
};

export { DialogFooter };
