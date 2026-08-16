import type { ReactNode } from 'react';
import { View } from 'react-native';
import { cn } from '@skyroc/utils';
import type { SlotClassNames } from '../../types/shared';
import { Button } from '../button';
import { numberKeyboardVariants } from './number-keyboard-variants';
import type { NumberKeyboardSlots } from './number-keyboard-variants';
import type { KeyConfig, KeyType } from './types';

/** 单个按键属性 */
interface NumberKeyboardKeyProps {
  /** 覆盖各插槽的 className */
  classNames?: SlotClassNames<NumberKeyboardSlots>;

  /** 删除按钮文字 */
  deleteButtonText?: string;

  /** 按键配置 */
  keyConfig: KeyConfig;

  /** 按键点击回调 */
  onPress: (text: string, type: KeyType) => void;

  /** 自定义删除按键内容 */
  renderDelete?: () => ReactNode;
}

const NumberKeyboardKey = (props: NumberKeyboardKeyProps) => {
  const { classNames, deleteButtonText, keyConfig, onPress, renderDelete } = props;

  const slots = numberKeyboardVariants();
  const isPlaceholder = keyConfig.text === '' && keyConfig.type !== 'delete';

  function renderContent() {
    if (keyConfig.type === 'delete') {
      return renderDelete ? renderDelete() : (deleteButtonText || '⌫');
    }
    return keyConfig.text || null;
  }

  function getTextClassName() {
    return keyConfig.type === 'delete' ? 'text-lg' : 'text-2xl';
  }

  return (
    <View className={cn(keyConfig.wider ? 'basis-2/3' : 'basis-1/3', 'p-[3px]')}>
      {isPlaceholder ? (
        <View className={cn(slots.key(), classNames?.key)} />
      ) : (
        <Button
          color="secondary"
          variant="ghost"
          className={cn(slots.key(), 'active:bg-muted', classNames?.key)}
          textClassName={getTextClassName()}
          onPress={() => onPress(keyConfig.text, keyConfig.type)}
        >
          {renderContent()}
        </Button>
      )}
    </View>
  );
};

export { NumberKeyboardKey };
