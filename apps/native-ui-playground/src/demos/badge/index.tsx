import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { BadgeBasic } from './BadgeBasic';
import { BadgeColor } from './BadgeColor';
import { BadgeMax } from './BadgeMax';
import { BadgeOffset } from './BadgeOffset';
import { BadgePosition } from './BadgePosition';
import { BadgeShowZero } from './BadgeShowZero';
import { BadgeSize } from './BadgeSize';
import { BadgeStandalone } from './BadgeStandalone';
import { BadgeStyles } from './BadgeStyles';
import { BadgeTextChildren } from './BadgeTextChildren';

/** Badge 的总览页，逐节复用同目录下的单点 demo，本文件只负责串场。 */
const BadgeDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="content 展示数字或文字；dot 切换为不带内容的小圆点。"
        title="基础用法（content / dot）"
      >
        <BadgeBasic />
      </Section>

      <Section
        description="数字大于 max 时显示 {max}+；默认 max 为 99。"
        title="数字封顶（max）"
      >
        <BadgeMax />
      </Section>

      <Section
        description="undefined、空字符串和默认的 0 都不显示；showZero 可让 0 保持可见。"
        title="空值与零值（showZero）"
      >
        <BadgeShowZero />
      </Section>

      <Section
        description="color 提供六种语义颜色，并同时作用于文字角标和圆点角标。"
        title="语义颜色（color）"
      >
        <BadgeColor />
      </Section>

      <Section
        description="size 提供 sm、md、lg 三档，并同步调整文字角标和圆点尺寸。"
        title="尺寸（size）"
      >
        <BadgeSize />
      </Section>

      <Section
        description="position 将角标挂载到 children 的四个角落。"
        title="挂载位置（position）"
      >
        <BadgePosition />
      </Section>

      <Section
        description="offset 在 position 的默认位置上按 [x, y] 做像素微调。"
        title="位置偏移（offset）"
      >
        <BadgeOffset />
      </Section>

      <Section
        description="省略 children 后，角标独立渲染，className 和底层 ViewProps 直接作用于角标。"
        title="独立使用（children）"
      >
        <BadgeStandalone />
      </Section>

      <Section
        description="content 支持 ReactElement；className / classNames 可覆盖 badge、content、dot、root。"
        title="自定义内容与样式（className / classNames）"
      >
        <BadgeStyles />
      </Section>

      <Section
        description="字符串和数字 children 会自动使用组件库 Text 渲染，其他节点保持原样。"
        title="文字子节点（children）"
      >
        <BadgeTextChildren />
      </Section>
    </ScrollView>
  );
};

export { BadgeDemo };
