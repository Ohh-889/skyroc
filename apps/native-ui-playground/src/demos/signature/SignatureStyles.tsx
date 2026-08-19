import { Signature } from '@skyroc/native-ui';
import { View } from 'react-native';
import { useResolveClassNames } from 'uniwind';

/** SignatureStyles 组件属性 */
interface SignatureStylesProps {
  /** 书写状态变化：外层是滚动容器时据此临时锁掉滚动 */
  onSigningChange?: (signing: boolean) => void;
}

const SignatureStyles = (props: SignatureStylesProps) => {
  const { onSigningChange } = props;

  const backgroundStyle = useResolveClassNames('bg-warning-50');
  const penStyle = useResolveClassNames('text-warning-700');

  const backgroundColor =
    typeof backgroundStyle.backgroundColor === 'string' ? backgroundStyle.backgroundColor : undefined;
  const penColor = typeof penStyle.color === 'string' ? penStyle.color : undefined;

  return (
    <View className="bg-background p-4">
      <Signature
        backgroundColor={backgroundColor}
        className="rounded-2xl border border-warning-200 p-3"
        classNames={{
          canvas: 'rounded-xl border-solid border-warning-300',
          footer: 'mt-4',
          tipsText: 'font-medium text-warning-700'
        }}
        clearButtonText="重新书写"
        confirmButtonText="使用签名"
        penColor={penColor}
        tips="自定义画布与画笔"
        onEnd={() => onSigningChange?.(false)}
        onStart={() => onSigningChange?.(true)}
      />
    </View>
  );
};

export { SignatureStyles };
