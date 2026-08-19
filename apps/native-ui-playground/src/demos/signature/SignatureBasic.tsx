import { Image, Signature, Text } from '@skyroc/native-ui';
import type { SignatureSubmitData } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** SignatureBasic 组件属性 */
interface SignatureBasicProps {
  /** 书写状态变化：外层是滚动容器时据此临时锁掉滚动，单独使用可以不传 */
  onSigningChange?: (signing: boolean) => void;
}

const SignatureBasic = (props: SignatureBasicProps) => {
  const { onSigningChange } = props;

  const [preview, setPreview] = useState('');
  const [tip, setTip] = useState('');

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
        tips="请在此处签名"
        onEnd={() => onSigningChange?.(false)}
        onStart={() => onSigningChange?.(true)}
        onSubmit={handleSubmit}
      />
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

export { SignatureBasic };
