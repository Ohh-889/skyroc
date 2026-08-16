import { View } from 'react-native';
import { cn } from '@skyroc/utils';
import { Button } from '../button/Button';
import { Text } from '../text/Typography';
import { pickerVariants } from './picker-variants';
import type { PickerToolbarProps } from './types';

/** Picker 顶部工具栏：取消 / 标题 / 确定 */
const PickerToolbar = (props: PickerToolbarProps) => {
  const { cancelText, classNames, confirmText, onCancel, onConfirm, title } = props;

  const slots = pickerVariants();

  const slotClassNames = {
    cancel: cn(slots.cancel(), classNames?.cancel),
    cancelText: cn(slots.cancelText(), classNames?.cancelText),
    confirm: cn(slots.confirm(), classNames?.confirm),
    confirmText: cn(slots.confirmText(), classNames?.confirmText),
    title: cn(slots.title(), classNames?.title),
    toolbar: cn(slots.toolbar(), classNames?.toolbar)
  };

  return (
    <View className={slotClassNames.toolbar}>
      <Button
        className={slotClassNames.cancel}
        color="muted"
        size="md"
        textClassName={slotClassNames.cancelText}
        variant="ghost"
        onPress={onCancel}
      >
        {cancelText}
      </Button>

      <Text
        className={slotClassNames.title}
        numberOfLines={1}
      >
        {title ?? ''}
      </Text>

      <Button
        className={slotClassNames.confirm}
        color="primary"
        size="md"
        textClassName={slotClassNames.confirmText}
        variant="ghost"
        onPress={onConfirm}
      >
        {confirmText}
      </Button>
    </View>
  );
};

export { PickerToolbar };
