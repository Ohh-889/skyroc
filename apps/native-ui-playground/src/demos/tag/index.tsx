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
        description="variant 决定标签的视觉强度。"
        title="Variants"
      >
        <TagVariant />
      </Section>

      <Section
        description="solid 变体下的六种语义色。"
        title="Colors (Solid)"
      >
        <TagColorSolid />
      </Section>

      <Section
        description="tonal 变体用淡色底搭配同色文字。"
        title="Colors (Tonal)"
      >
        <TagColorTonal />
      </Section>

      <Section
        description="outline 变体只保留描边。"
        title="Colors (Outline)"
      >
        <TagColorOutline />
      </Section>

      <Section
        description="ghost 变体没有底色和描边。"
        title="Colors (Ghost)"
      >
        <TagColorGhost />
      </Section>

      <Section
        description="size 同时控制字号与内边距。"
        title="Sizes"
      >
        <TagSize />
      </Section>

      <Section
        description="shape 支持标准圆角、药丸和标记形。"
        title="Shapes"
      >
        <TagShape />
      </Section>

      <Section
        description="closeable 显示关闭按钮，是否移除标签由 onClose 自己决定。"
        title="Closeable"
      >
        <TagCloseable />
      </Section>

      <Section
        description="color、variant、size、shape 可以任意组合。"
        title="Combined"
      >
        <TagCombined />
      </Section>
    </ScrollView>
  );
};

export { TagDemo };
