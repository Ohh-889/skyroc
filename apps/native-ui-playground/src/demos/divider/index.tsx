import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { DividerBasic } from './DividerBasic';
import { DividerCustomStyle } from './DividerCustomStyle';
import { DividerDashed } from './DividerDashed';
import { DividerHairline } from './DividerHairline';
import { DividerText } from './DividerText';
import { DividerVertical } from './DividerVertical';
import { DividerVerticalDashed } from './DividerVerticalDashed';
import { DividerVerticalHeight } from './DividerVerticalHeight';

/**
 * Divider 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/divider/DividerBasic" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
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
        description="children 作为分割线文字，align 控制文字位置。"
        title="带文字（children / align）"
      >
        <DividerText />
      </Section>

      <Section
        description="border 切换为虚线样式，可与文字同时使用。"
        title="虚线（border）"
      >
        <DividerDashed />
      </Section>

      <Section
        description="默认使用设备最细线；hairline={false} 固定为 1px。"
        title="线宽（hairline）"
      >
        <DividerHairline />
      </Section>

      <Section
        description="orientation 设为 vertical 后用于行内切分。"
        title="竖向（orientation）"
      >
        <DividerVertical />
      </Section>

      <Section
        description="竖向分割线同样支持虚线。"
        title="竖向虚线（orientation / border）"
      >
        <DividerVerticalDashed />
      </Section>

      <Section
        description="竖向分割线撑满父容器高度，需要父容器有确定高度。"
        title="竖向高度"
      >
        <DividerVerticalHeight />
      </Section>

      <Section
        description="classNames 分别覆盖 line 和 text 的样式。"
        title="自定义样式（classNames）"
      >
        <DividerCustomStyle />
      </Section>
    </ScrollView>
  );
};

export { DividerDemo };
