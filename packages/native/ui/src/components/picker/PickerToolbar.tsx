import { View } from 'react-native';
import { cn } from '@skyroc/utils';
import { Button } from '../button/Button';
import { Text } from '../text/Typography';
import { pickerVariants } from './picker-variants';
import type { PickerToolbarProps } from './types';

const PickerToolbar = (props: PickerToolbarProps) => {
  const { cancelText, classNames, confirmText, onCancel, onConfirm, title } = props;

  const slots = pickerVariants();

  return (
    <View className={cn(slots.toolbar(), classNames?.toolbar)}>
      <Button
        className={classNames?.cancel}
        color="muted"
        size="md"
        variant="ghost"
        onPress={onCancel}
      >
        {cancelText}
      </Button>

      <Text
        className={cn(slots.title(), classNames?.title)}
        numberOfLines={1}
      >
        {title ?? ''}
      </Text>

      <Button
        className={classNames?.confirm}
        color="primary"
        size="md"
        variant="ghost"
        onPress={onConfirm}
      >
        {confirmText}
      </Button>
    </View>
  );
};

export { PickerToolbar };
