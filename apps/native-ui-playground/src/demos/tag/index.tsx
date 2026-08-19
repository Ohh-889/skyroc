import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { TagCloseable } from './TagCloseable';
import { TagColorGhost } from './TagColorGhost';
import { TagColorOutline } from './TagColorOutline';
import { TagColorSolid } from './TagColorSolid';
import { TagColorTonal } from './TagColorTonal';
import { TagCombined } from './TagCombined';
import { TagShape } from './TagShape';
import { TagSize } from './TagSize';
import { TagStyles } from './TagStyles';
import { TagVariant } from './TagVariant';

/** Tag 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/tag/TagShape" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const TagDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="variant 提供 solid、tonal、outline、ghost 四种视觉强度。"
        title="视觉变体（variant）"
      >
        <TagVariant />
      </Section>

      <Section
        description="solid 使用完整语义底色与对应前景色。"
        title="语义颜色：solid（color）"
      >
        <TagColorSolid />
      </Section>

      <Section
        description="tonal 使用低饱和底色与同语义文字。"
        title="语义颜色：tonal（color）"
      >
        <TagColorTonal />
      </Section>

      <Section
        description="outline 使用语义描边与文字，背景保持透明。"
        title="语义颜色：outline（color）"
      >
        <TagColorOutline />
      </Section>

      <Section
        description="ghost 仅保留语义文字，不显示底色和描边。"
        title="语义颜色：ghost（color）"
      >
        <TagColorGhost />
      </Section>

      <Section
        description="size 同时控制字号与内边距。"
        title="尺寸（size）"
      >
        <TagSize />
      </Section>

      <Section
        description="shape 支持标准圆角、药丸和标记形。"
        title="形状（shape）"
      >
        <TagShape />
      </Section>

      <Section
        description="closeable 显示关闭按钮；onClose 只通知事件，是否移除由外部状态决定。"
        title="可关闭（closeable / onClose）"
      >
        <TagCloseable />
      </Section>

      <Section
        description="leading 放置前置内容；children 支持文字、数字或继承标签文字色的自定义节点。"
        title="自定义内容（leading / children）"
      >
        <TagCombined />
      </Section>

      <Section
        description="className 覆盖根节点，classNames 可覆盖文字、关闭按钮和关闭图标。"
        title="样式覆盖（className / classNames）"
      >
        <TagStyles />
      </Section>
    </ScrollView>
  );
};

export { TagDemo };
