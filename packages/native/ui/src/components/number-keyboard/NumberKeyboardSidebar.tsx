import type { ReactNode } from 'react';
import { View } from 'react-native';
import { cn } from '@skyroc/utils';
import type { SlotClassNames } from '../../types/shared';
import { Button } from '../button';
import { numberKeyboardVariants } from './number-keyboard-variants';
import type { NumberKeyboardSlots } from './number-keyboard-variants';

/** 键盘侧边栏属性 */
interface NumberKeyboardSidebarProps {
  /** 覆盖各插槽的 className */
  classNames?: SlotClassNames<NumberKeyboardSlots>;

  /** 关闭按钮文字 */
  closeButtonText?: string;

  /** 删除按钮文字 */
  deleteButtonText?: string;

  /** 关闭回调 */
  onClose: () => void;

  /** 删除回调 */
  onDelete: () => void;

  /** 自定义删除按键内容 */
  renderDelete?: () => ReactNode;

  /** 是否显示删除按钮 */
  showDeleteKey: boolean;
}

const NumberKeyboardSidebar = (props: NumberKeyboardSidebarProps) => {
  const { classNames, closeButtonText, deleteButtonText, onClose, onDelete, renderDelete, showDeleteKey } = props;

  const slots = numberKeyboardVariants();

  return (
    <View className={cn(slots.sidebar(), classNames?.sidebar)}>
      {showDeleteKey ? (
        <Button
          color="secondary"
          variant="ghost"
          className={cn(slots.key(), 'flex-1 active:bg-muted', classNames?.key)}
          textClassName="text-lg"
          onPress={onDelete}
        >
          {renderDelete ? renderDelete() : (deleteButtonText || '⌫')}
        </Button>
      ) : null}
      <Button
        color="primary"
        variant="solid"
        className={cn('h-12 flex-1 items-center justify-center rounded-lg px-0', classNames?.key)}
        textClassName="text-lg"
        onPress={onClose}
      >
        {closeButtonText || '完成'}
      </Button>
    </View>
  );
};

export { NumberKeyboardSidebar };
