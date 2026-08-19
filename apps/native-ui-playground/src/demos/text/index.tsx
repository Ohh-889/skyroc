import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { TextBasic } from './TextBasic';
import { TextColor } from './TextColor';
import { TextCombination } from './TextCombination';
import { TextContext } from './TextContext';
import { TextNativeProps } from './TextNativeProps';
import { TextSize } from './TextSize';
import { TextStyles } from './TextStyles';
import { TextWeight } from './TextWeight';

/** Text 的总览页，逐节复用同目录下的单点 demo，本文件只负责串场。 */
const TextDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="未传变体时使用前景色、base 字号与 normal 字重。"
        title="基础用法"
      >
        <TextBasic />
      </Section>

      <Section
        description="size 从 4xs 到 4xl 共十二个公开值，其中 md 与 base 都映射为基础字号。"
        title="字号（size）"
      >
        <TextSize />
      </Section>

      <Section
        description="weight 支持 normal、medium、semibold 与 bold。"
        title="字重（weight）"
      >
        <TextWeight />
      </Section>

      <Section
        description="color 提供九种语义色，并随当前主题自动切换。"
        title="语义颜色（color）"
      >
        <TextColor />
      </Section>

      <Section
        description="size、weight 与 color 相互独立，可以自由组合。"
        title="组合变体"
      >
        <TextCombination />
      </Section>

      <Section
        description="Text 在 Button 等组件内会继承 TextClassContext；显式变体仍可覆盖继承值。"
        title="上下文样式继承（TextClassContext）"
      >
        <TextContext />
      </Section>

      <Section
        description="className 优先级高于 color、size 与 weight 变体。"
        title="自定义样式（className）"
      >
        <TextStyles />
      </Section>

      <Section
        description="numberOfLines、selectable、onPress 等 React Native Text 属性会透传到底层节点。"
        title="原生文字属性透传"
      >
        <TextNativeProps />
      </Section>
    </ScrollView>
  );
};

export { TextDemo };
