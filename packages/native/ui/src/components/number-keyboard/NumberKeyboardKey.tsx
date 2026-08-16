import { cn } from '@skyroc/utils';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Button } from '../button';
import type { KeyConfig, KeyType, ResolvedSlotClassNames } from './types';

/** 单个按键属性 */
interface NumberKeyboardKeyProps {
  /** 父组件解析好的插槽类名 */
  classNames: ResolvedSlotClassNames;

  /** 删除键要显示的内容，由父组件依据 renderDelete / deleteButtonText 解析后下发 */
  deleteContent: ReactNode;

  /** 按键配置 */
  keyConfig: KeyConfig;

  /** 按键点击回调 */
  onPress: (text: string, type: KeyType) => void;
}

const NumberKeyboardKey = (props: NumberKeyboardKeyProps) => {
  const { classNames, deleteContent, keyConfig, onPress } = props;

  const isDelete = keyConfig.type === 'delete';

  function renderContent() {
    return isDelete ? deleteContent : keyConfig.text;
  }

  return (
    // basis 是三列网格的算术，不做成插槽：能改的是格子有多宽的观感（keyWrapper），不是网格分几列
    <View className={cn(keyConfig.wider ? 'basis-2/3' : 'basis-1/3', classNames.keyWrapper)}>
      {keyConfig.type === 'placeholder' ? (
        // 占位格照常画出按键底色，网格的行列节奏才不会断在缺口上
        <View className={classNames.key} />
      ) : (
        <Button
          className={classNames.key}
          color="secondary"
          textClassName={isDelete ? classNames.functionKeyText : classNames.keyText}
          variant="ghost"
          onPress={() => onPress(keyConfig.text, keyConfig.type)}
        >
          {renderContent()}
        </Button>
      )}
    </View>
  );
};

export { NumberKeyboardKey };
