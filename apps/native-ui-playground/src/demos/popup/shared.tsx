import { Button, Text } from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { View } from 'react-native';

interface PopupPanelProps {
  /** 面板正文，通常是若干说明文字 */
  children?: ReactNode;

  /** 关闭按钮的回调 */
  onClose: () => void;

  /** 面板标题 */
  title: string;
}

/**
 * 各个 Popup demo 共用的面板内容。
 *
 * 抽出来是因为九个 demo 都要「标题 + 正文 + 关闭按钮」这一套，重复写会把每段示例的重点淹掉。
 */
const PopupPanel = (props: PopupPanelProps) => {
  const { children, onClose, title } = props;

  return (
    <View className="gap-3 p-6">
      <Text className="text-lg font-semibold">{title}</Text>

      {children}

      <Button
        variant="outline"
        onPress={onClose}
      >
        关闭
      </Button>
    </View>
  );
};

export { PopupPanel };
export type { PopupPanelProps };
