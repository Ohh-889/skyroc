import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { RateBasic } from './RateBasic';
import { RateClearable } from './RateClearable';
import { RateColor } from './RateColor';
import { RateControlled } from './RateControlled';
import { RateDisabled } from './RateDisabled';
import { RateHalf } from './RateHalf';
import { RateIcon } from './RateIcon';
import { RateReadonly } from './RateReadonly';
import { RateSize } from './RateSize';
import { RateStyles } from './RateStyles';

/** Rate 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/rate/RateHalf" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const RateDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="value 与 onChange 组成受控评分，默认 5 颗星。"
        title="基础用法"
      >
        <RateBasic />
      </Section>

      <Section
        description="点星星左半区得 .5 分，右半区得整分"
        title="半星"
      >
        <RateHalf />
      </Section>

      <Section
        description="再次点中当前分值即归零"
        title="可清除"
      >
        <RateClearable />
      </Section>

      <Section
        description="count 控制星星数量，size 与 gutter 控制图标大小和间距。"
        title="数量与尺寸"
      >
        <RateSize />
      </Section>

      <Section
        description="color 提供与主题一致的语义色。"
        title="主题色"
      >
        <RateColor />
      </Section>

      <Section
        description="readonly 配合 allowHalf 可展示任意小数，用于统计分"
        title="只读小数"
      >
        <RateReadonly />
      </Section>

      <Section
        description="disabled 会阻止交互并降低透明度。"
        title="禁用"
      >
        <RateDisabled />
      </Section>

      <Section
        description="icon / voidIcon 支持节点或 (index, active) => 节点，宽度需与 size 一致"
        title="自定义图标"
      >
        <RateIcon />
      </Section>

      <Section
        description="className 覆盖根容器，classNames 细粒度覆盖各 slot"
        title="自定义样式"
      >
        <RateStyles />
      </Section>

      <Section
        description="分值完全由外部 state 决定，按钮也能改写它。"
        title="受控"
      >
        <RateControlled />
      </Section>
    </ScrollView>
  );
};

export { RateDemo };
