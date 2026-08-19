import { Signature, Text } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { View } from 'react-native';

/** SignatureEvents 组件属性 */
interface SignatureEventsProps {
  /** 书写状态变化：外层是滚动容器时据此临时锁掉滚动 */
  onSigningChange?: (signing: boolean) => void;
}

const SignatureEvents = (props: SignatureEventsProps) => {
  const { onSigningChange } = props;

  const [status, setStatus] = useState('等待落笔');

  const signingCountRef = useRef(0);

  function handleStart() {
    signingCountRef.current = 0;
    setStatus('onStart：已落笔');
    onSigningChange?.(true);
  }

  function handleSigning() {
    signingCountRef.current += 1;
  }

  function handleEnd() {
    setStatus(`onEnd：本笔触发 onSigning ${signingCountRef.current} 次`);
    onSigningChange?.(false);
  }

  function handleClear() {
    setStatus('onClear：画布已清空');
  }

  return (
    <View className="gap-2 bg-background p-4">
      <Signature
        clearButtonText="清空笔迹"
        confirmButtonText="生成图片"
        tips="写一笔后观察回调"
        onClear={handleClear}
        onEnd={handleEnd}
        onSigning={handleSigning}
        onStart={handleStart}
      />
      <Text className="text-sm text-muted-foreground">{status}</Text>
    </View>
  );
};

export { SignatureEvents };
