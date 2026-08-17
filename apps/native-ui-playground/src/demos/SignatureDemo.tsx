import { Button, Image, Signature, Text } from '@skyroc/native-ui';
import type { SignatureRef, SignatureSubmitData } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

const SignatureDemo = () => {
  const [preview, setPreview] = useState('');
  const [tip, setTip] = useState('');

  // 画布的 Pan 手势和 ScrollView 的滚动会互相抢：纵向落笔容易被判成滚动。
  // 组件用 onStart / onEnd 把「正在书写」暴露出来，页面据此临时锁掉滚动
  const [signing, setSigning] = useState(false);

  const manualRef = useRef<SignatureRef>(null);

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
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      scrollEnabled={!signing}
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 text-lg font-semibold">基础用法</Text>
      <View className="mb-8">
        <Signature
          tips="请在此处签名"
          onEnd={() => setSigning(false)}
          onStart={() => setSigning(true)}
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

      {/* 笔色 */}
      <Text className="mb-4 text-lg font-semibold">笔色</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        默认 carbon —— 浅色主题近黑、深色主题近白，跟着主题走
      </Text>
      <View className="mb-8">
        <Signature
          color="primary"
          showFooter={false}
          tips="primary 笔色"
          onEnd={() => setSigning(false)}
          onStart={() => setSigning(true)}
        />
      </View>

      {/* 尺寸与线宽 */}
      <Text className="mb-4 text-lg font-semibold">尺寸与线宽</Text>
      <View className="mb-8 gap-4">
        <Signature
          lineWidth={1.5}
          showFooter={false}
          size="sm"
          tips="sm + 细笔"
          onEnd={() => setSigning(false)}
          onStart={() => setSigning(true)}
        />
        <Signature
          color="destructive"
          lineWidth={6}
          showFooter={false}
          size="lg"
          tips="lg + 粗笔"
          onEnd={() => setSigning(false)}
          onStart={() => setSigning(true)}
        />
      </View>

      {/* 命令式调用 */}
      <Text className="mb-4 text-lg font-semibold">命令式调用</Text>
      <View className="mb-8">
        <Signature
          ref={manualRef}
          showFooter={false}
          tips="用下面的按钮控制"
          onEnd={() => setSigning(false)}
          onStart={() => setSigning(true)}
          onSubmit={handleSubmit}
        />
        <View className="mt-3 flex-row gap-2">
          <Button
            className="flex-1"
            variant="outline"
            onPress={() => manualRef.current?.undo()}
          >
            撤销
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onPress={() => manualRef.current?.clear()}
          >
            清除
          </Button>
          <Button
            className="flex-1"
            onPress={() => manualRef.current?.submit()}
          >
            提交
          </Button>
        </View>
      </View>

      {/* 导出 JPEG */}
      <Text className="mb-4 text-lg font-semibold">导出 JPEG</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        JPEG 没有 alpha 通道，透明底会被压成纯黑，所以会自动回落到画布底色
      </Text>
      <View className="mb-8">
        <Signature
          quality={60}
          tips="导出为 jpeg"
          type="jpeg"
          onEnd={() => setSigning(false)}
          onStart={() => setSigning(true)}
          onSubmit={handleSubmit}
        />
      </View>

      {/* 禁用与只读 */}
      <Text className="mb-4 text-lg font-semibold">禁用与只读</Text>
      <View className="mb-8 gap-4">
        <Signature
          disabled
          tips="禁用状态"
        />
        <Signature
          readonly
          tips="只读：画不上，但按钮仍可用"
        />
      </View>
    </ScrollView>
  );
};

export { SignatureDemo };
