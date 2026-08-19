import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { SignatureBasic } from './SignatureBasic';
import { SignatureColor } from './SignatureColor';
import { SignatureDisabled } from './SignatureDisabled';
import { SignatureImperative } from './SignatureImperative';
import { SignatureJpeg } from './SignatureJpeg';
import { SignatureSize } from './SignatureSize';

/**
 * Signature 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/signature/SignatureColor" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const SignatureDemo = () => {
  // 画布的 Pan 手势和 ScrollView 的滚动会互相抢：纵向落笔容易被判成滚动。
  // 组件用 onStart / onEnd 把「正在书写」暴露出来，页面据此临时锁掉滚动
  const [signing, setSigning] = useState(false);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      scrollEnabled={!signing}
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="onSubmit 回传 base64 图片与是否为空，可直接拿去预览"
        title="基础用法"
      >
        <SignatureBasic onSigningChange={setSigning} />
      </Section>

      <Section
        description="默认 carbon —— 浅色主题近黑、深色主题近白，跟着主题走"
        title="笔色"
      >
        <SignatureColor onSigningChange={setSigning} />
      </Section>

      <Section
        description="size 控制画布高度，lineWidth 控制笔画粗细"
        title="尺寸与线宽"
      >
        <SignatureSize onSigningChange={setSigning} />
      </Section>

      <Section
        description="ref 暴露 undo / clear / submit，可以自己画底部操作区"
        title="命令式调用"
      >
        <SignatureImperative onSigningChange={setSigning} />
      </Section>

      <Section
        description="JPEG 没有 alpha 通道，透明底会被压成纯黑，所以会自动回落到画布底色"
        title="导出 JPEG"
      >
        <SignatureJpeg onSigningChange={setSigning} />
      </Section>

      <Section
        description="disabled 连按钮一起禁用，readonly 只锁画布"
        title="禁用与只读"
      >
        <SignatureDisabled />
      </Section>
    </ScrollView>
  );
};

export { SignatureDemo };
