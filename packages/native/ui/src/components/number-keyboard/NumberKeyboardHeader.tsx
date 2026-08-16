import { View } from 'react-native';
import { cn } from '@skyroc/utils';
import type { SlotClassNames } from '../../types/shared';
import { Button } from '../button';
import { Text } from '../text/Typography';
import { numberKeyboardVariants } from './number-keyboard-variants';
import type { NumberKeyboardSlots } from './number-keyboard-variants';
import type { NumberKeyboardTheme } from './types';

/** 键盘头部属性 */
interface NumberKeyboardHeaderProps {
  /** 覆盖各插槽的 className */
  classNames?: SlotClassNames<NumberKeyboardSlots>;

  /** 关闭按钮文字 */
  closeButtonText?: string;

  /** 关闭回调 */
  onClose: () => void;

  /** 键盘主题 */
  theme: NumberKeyboardTheme;

  /** 键盘标题 */
  title?: string;
}

const NumberKeyboardHeader = (props: NumberKeyboardHeaderProps) => {
  const { classNames, closeButtonText, onClose, theme, title } = props;

  const slots = numberKeyboardVariants();
  const showClose = closeButtonText && theme === 'default';
  const showHeader = title || showClose;

  if (!showHeader) return null;

  return (
    <View className={cn(slots.header(), classNames?.header)}>
      <View className="w-16" />
      {title ? <Text className={cn(slots.title(), classNames?.title)}>{title}</Text> : <View className="flex-1" />}
      {showClose ? (
        <Button
          color="primary"
          variant="ghost"
          className="w-16 px-0"
          textClassName={cn(slots.closeBtn(), classNames?.closeBtn)}
          onPress={onClose}
        >
          {closeButtonText}
        </Button>
      ) : (
        <View className="w-16" />
      )}
    </View>
  );
};

export { NumberKeyboardHeader };
