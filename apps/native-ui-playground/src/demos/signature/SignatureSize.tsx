import { Signature } from '@skyroc/native-ui';
import { View } from 'react-native';

/** SignatureSize 组件属性 */
interface SignatureSizeProps {
  /** 书写状态变化：外层是滚动容器时据此临时锁掉滚动，单独使用可以不传 */
  onSigningChange?: (signing: boolean) => void;
}

const SignatureSize = (props: SignatureSizeProps) => {
  const { onSigningChange } = props;

  return (
    <View className="gap-4 bg-background p-4">
      <Signature
        lineWidth={1.5}
        showFooter={false}
        size="sm"
        tips="sm + 细笔"
        onEnd={() => onSigningChange?.(false)}
        onStart={() => onSigningChange?.(true)}
      />
      <Signature
        color="destructive"
        lineWidth={6}
        showFooter={false}
        size="lg"
        tips="lg + 粗笔"
        onEnd={() => onSigningChange?.(false)}
        onStart={() => onSigningChange?.(true)}
      />
    </View>
  );
};

export { SignatureSize };
