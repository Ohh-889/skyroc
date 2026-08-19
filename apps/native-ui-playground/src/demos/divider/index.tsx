import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { DividerBasic } from './DividerBasic';
import { DividerCustomContent } from './DividerCustomContent';
import { DividerCustomStyle } from './DividerCustomStyle';
import { DividerDashed } from './DividerDashed';
import { DividerHairline } from './DividerHairline';
import { DividerText } from './DividerText';
import { DividerVertical } from './DividerVertical';

/** Divider 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/divider/DividerBasic" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const DividerDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="默认横向分割线，用于切分上下内容。"
        title="基础用法"
      >
        <DividerBasic />
      </Section>

      <Section
        description="字符串 children 会自动使用 Text 渲染，align 支持 start、center 和 end。"
        title="带文字与对齐（children / align）"
      >
        <DividerText />
      </Section>

      <Section
        description="border 支持 solid、dashed 和 dotted 三种线型。"
        title="线型（border）"
      >
        <DividerDashed />
      </Section>

      <Section
        description="默认使用 1 物理像素细线；hairline={false} 改为 1dp，仅对 solid 生效。"
        title="线宽（hairline）"
      >
        <DividerHairline />
      </Section>

      <Section
        description="orientation 支持 horizontal 和 vertical；竖向分割线需要横向且高度明确的父容器。"
        title="方向（orientation）"
      >
        <DividerVertical />
      </Section>

      <Section
        description="children 也可以传入任意 React 节点。"
        title="自定义内容（children）"
      >
        <DividerCustomContent />
      </Section>

      <Section
        description="className 覆盖根容器；classNames 可分别覆盖 line、lineLeading、lineTrailing、root 和 text。"
        title="样式覆盖（className / classNames）"
      >
        <DividerCustomStyle />
      </Section>
    </ScrollView>
  );
};

export { DividerDemo };
