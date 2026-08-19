import { Button, Image, Signature, Text } from '@skyroc/native-ui';
import type { SignatureRef, SignatureSubmitData } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { View } from 'react-native';

/** SignatureImperative 组件属性 */
interface SignatureImperativeProps {
  /** 书写状态变化：外层是滚动容器时据此临时锁掉滚动，单独使用可以不传 */
  onSigningChange?: (signing: boolean) => void;
}

const SignatureImperative = (props: SignatureImperativeProps) => {
  const { onSigningChange } = props;

  const [preview, setPreview] = useState('');
  const [tip, setTip] = useState('');

  const signatureRef = useRef<SignatureRef>(null);

  function handleSubmit(data: SignatureSubmitData) {
    if (data.isEmpty) {
      setTip('还没签名');
      setPreview('');
      return;
    }

    setTip(`已生成，base64 长度 ${data.image.length}`);
    setPreview(data.image);
  }

  return (
    <View className="bg-background p-4">
      <Signature
        ref={signatureRef}
        showFooter={false}
        tips="用下面的按钮控制"
        onEnd={() => onSigningChange?.(false)}
        onStart={() => onSigningChange?.(true)}
        onSubmit={handleSubmit}
      />
      <View className="mt-3 flex-row gap-2">
        <Button
          className="flex-1"
          variant="outline"
          onPress={() => signatureRef.current?.undo()}
        >
          撤销
        </Button>
        <Button
          className="flex-1"
          variant="outline"
          onPress={() => signatureRef.current?.clear()}
        >
          清除
        </Button>
        <Button
          className="flex-1"
          onPress={() => signatureRef.current?.submit()}
        >
          提交
        </Button>
      </View>
      {tip ? (
        <Text
          className="mt-2"
          color="muted"
        >
          {tip}
        </Text>
      ) : null}
      {preview ? (
        <Image
          className="mt-2 h-[120px] w-full rounded-lg border border-border"
          contentFit="contain"
          src={preview}
        />
      ) : null}
    </View>
  );
};

export { SignatureImperative };
