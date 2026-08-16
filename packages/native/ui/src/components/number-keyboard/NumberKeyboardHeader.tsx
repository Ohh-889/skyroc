import { View } from 'react-native';
import { Button } from '../button';
import { Text } from '../text/Typography';
import type { ResolvedSlotClassNames } from './types';

/** 键盘头部属性 */
interface NumberKeyboardHeaderProps {
  /** 父组件解析好的插槽类名 */
  classNames: ResolvedSlotClassNames;

  /** 关闭按钮文字 */
  closeButtonText?: string;

  /** 关闭回调 */
  onClose: () => void;

  /** 是否在标题栏右侧显示关闭按钮，由父组件按主题判定 */
  showClose: boolean;

  /** 键盘标题 */
  title?: string;
}

const NumberKeyboardHeader = (props: NumberKeyboardHeaderProps) => {
  const { classNames, closeButtonText, onClose, showClose, title } = props;

  const showHeader = Boolean(title) || showClose;

  if (!showHeader) return null;

  return (
    <View className={classNames.header}>
      <View className={classNames.headerSide} />

      {/* 无标题时补一个撑满的空档，把关闭按钮顶到最右边 */}
      {title ? <Text className={classNames.title}>{title}</Text> : <View className="flex-1" />}

      {showClose ? (
        <Button
          className={classNames.headerSide}
          classNames={{ text: classNames.closeBtn }}
          color="primary"
          variant="ghost"
          onPress={onClose}
        >
          {closeButtonText}
        </Button>
      ) : (
        <View className={classNames.headerSide} />
      )}
    </View>
  );
};

export { NumberKeyboardHeader };
