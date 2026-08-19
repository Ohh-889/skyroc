import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { SliderBasic } from './SliderBasic';
import { SliderBoundary } from './SliderBoundary';
import { SliderChangeAfterDrag } from './SliderChangeAfterDrag';
import { SliderColor } from './SliderColor';
import { SliderControlled } from './SliderControlled';
import { SliderCustomThumb } from './SliderCustomThumb';
import { SliderDisabled } from './SliderDisabled';
import { SliderRange } from './SliderRange';
import { SliderSize } from './SliderSize';
import { SliderStep } from './SliderStep';
import { SliderStyles } from './SliderStyles';
import { SliderVertical } from './SliderVertical';

/** Slider 的总览页，逐节复用同目录下的单点 demo，本文件只负责串场。 */
const SliderDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="value 与 onChange 组成单值受控滑块。"
        title="基础用法（value / onChange）"
      >
        <SliderBasic />
      </Section>

      <Section
        description="min、max 限定范围，取值会对齐到 min + n × step。"
        title="步长与范围（min / max / step）"
      >
        <SliderStep />
      </Section>

      <Section
        description="越界值会夹回 min / max，非正 step 按 1 处理，区间缺省值为 [min, min]。"
        title="边界值"
      >
        <SliderBoundary />
      </Section>

      <Section
        description="range 切换为双滑块区间，两端互为边界且不会穿越。"
        title="区间选择（range）"
      >
        <SliderRange />
      </Section>

      <Section
        description="onChange 拖动中实时触发，onChangeAfterDrag 在值稳定后触发一次。"
        title="拖动结束事件（onChangeAfterDrag）"
      >
        <SliderChangeAfterDrag />
      </Section>

      <Section
        description="color 提供与操作语义对应的主题色。"
        title="语义颜色（color）"
      >
        <SliderColor />
      </Section>

      <Section
        description="barSize 控制轨道粗细，thumbSize 控制滑块直径；命中区仍不小于 44pt。"
        title="尺寸（barSize / thumbSize）"
      >
        <SliderSize />
      </Section>

      <Section
        description="vertical 改为垂直方向，父容器需要提供确定高度，单值和区间均适用。"
        title="垂直方向（vertical）"
      >
        <SliderVertical />
      </Section>

      <Section
        description="单值使用 thumb，区间使用 startThumb 与 endThumb 替换默认滑块。"
        title="自定义滑块（thumb / startThumb / endThumb）"
      >
        <SliderCustomThumb />
      </Section>

      <Section
        description="disabled 阻止手势并置灰；readonly 只阻止手势，不改变视觉状态。"
        title="禁用与只读（disabled / readonly）"
      >
        <SliderDisabled />
      </Section>

      <Section
        description="className 覆盖根容器，classNames 可覆盖轨道、激活段和滑块等 slot。"
        title="样式覆盖（className / classNames）"
      >
        <SliderStyles />
      </Section>

      <Section
        description="外部按钮与 Slider 共享 value，展示受控值可以从组件外更新。"
        title="外部控制（value）"
      >
        <SliderControlled />
      </Section>
    </ScrollView>
  );
};

export { SliderDemo };
