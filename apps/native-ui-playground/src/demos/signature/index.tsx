import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { SignatureBasic } from './SignatureBasic';
import { SignatureColor } from './SignatureColor';
import { SignatureDisabled } from './SignatureDisabled';
import { SignatureEvents } from './SignatureEvents';
import { SignatureImperative } from './SignatureImperative';
import { SignatureJpeg } from './SignatureJpeg';
import { SignatureSize } from './SignatureSize';
import { SignatureStyles } from './SignatureStyles';

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
        description="tips 提示落笔区域；确认后 onSubmit 回传 base64 图片与 isEmpty，可直接预览。"
        title="基础用法（tips / onSubmit）"
      >
        <SignatureBasic onSigningChange={setSigning} />
      </Section>

      <Section
        description="color 提供八种语义色；默认 carbon 会随深浅主题切换墨色。"
        title="语义笔色（color）"
      >
        <SignatureColor onSigningChange={setSigning} />
      </Section>

      <Section
        description="size 控制画布高度，lineWidth 控制笔画粗细。"
        title="尺寸与线宽（size / lineWidth）"
      >
        <SignatureSize onSigningChange={setSigning} />
      </Section>

      <Section
        description="ref 暴露 undo、clear、submit 与 toDataURL，可在 showFooter=false 时自定义操作区。"
        title="命令式调用（ref / showFooter）"
      >
        <SignatureImperative onSigningChange={setSigning} />
      </Section>

      <Section
        description="type 选择 png 或 jpeg，quality 控制编码质量；JPEG 透明底会自动回落到画布底色。"
        title="导出格式（type / quality）"
      >
        <SignatureJpeg onSigningChange={setSigning} />
      </Section>

      <Section
        description="onStart / onSigning / onEnd 描述一次笔画周期；清空时触发 onClear。"
        title="书写事件"
      >
        <SignatureEvents onSigningChange={setSigning} />
      </Section>

      <Section
        description="backgroundColor / penColor 可传运行时颜色；className / classNames 覆盖容器和各 slot。"
        title="自定义颜色与样式"
      >
        <SignatureStyles onSigningChange={setSigning} />
      </Section>

      <Section
        description="disabled 连按钮一起禁用并降低透明度，readonly 只锁定画布。"
        title="禁用与只读（disabled / readonly）"
      >
        <SignatureDisabled />
      </Section>
    </ScrollView>
  );
};

export { SignatureDemo };
