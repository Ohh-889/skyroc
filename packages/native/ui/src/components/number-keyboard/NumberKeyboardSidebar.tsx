import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Button } from '../button';
import type { ResolvedSlotClassNames } from './types';

/** 关闭按钮文字兜底，custom 主题的侧边栏永远有这颗键，不能留空 */
const DEFAULT_CONFIRM_TEXT = '完成';

/** 键盘侧边栏属性 */
interface NumberKeyboardSidebarProps {
  /** 父组件解析好的插槽类名 */
  classNames: ResolvedSlotClassNames;

  /** 关闭按钮文字 */
  closeButtonText?: string;

  /** 删除键要显示的内容，由父组件依据 renderDelete / deleteButtonText 解析后下发 */
  deleteContent: ReactNode;

  /** 关闭回调 */
  onClose: () => void;

  /** 删除回调 */
  onDelete: () => void;

  /** 是否显示删除按钮 */
  showDeleteKey: boolean;
}

const NumberKeyboardSidebar = (props: NumberKeyboardSidebarProps) => {
  const { classNames, closeButtonText, deleteContent, onClose, onDelete, showDeleteKey } = props;

  return (
    <View className={classNames.sidebar}>
      {showDeleteKey ? (
        <Button
          className={classNames.deleteKey}
          classNames={{ text: classNames.functionKeyText }}
          color="secondary"
          variant="ghost"
          onPress={onDelete}
        >
          {deleteContent}
        </Button>
      ) : null}

      <Button
        className={classNames.confirmKey}
        classNames={{ text: classNames.functionKeyText }}
        color="primary"
        variant="solid"
        onPress={onClose}
      >
        {closeButtonText || DEFAULT_CONFIRM_TEXT}
      </Button>
    </View>
  );
};

export { NumberKeyboardSidebar };
