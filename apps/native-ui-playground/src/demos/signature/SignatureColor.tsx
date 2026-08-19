import { Signature } from '@skyroc/native-ui';
import { View } from 'react-native';

/** SignatureColor 组件属性 */
interface SignatureColorProps {
  /** 书写状态变化：外层是滚动容器时据此临时锁掉滚动，单独使用可以不传 */
  onSigningChange?: (signing: boolean) => void;
}

const SignatureColor = (props: SignatureColorProps) => {
  const { onSigningChange } = props;

  return (
    <View className="bg-background p-4">
      <Signature
        color="primary"
        showFooter={false}
        tips="primary 笔色"
        onEnd={() => onSigningChange?.(false)}
        onStart={() => onSigningChange?.(true)}
      />
    </View>
  );
};

export { SignatureColor };
