import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { RadioBasic } from './RadioBasic';
import { RadioCardBasic } from './RadioCardBasic';
import { RadioCardGroup } from './RadioCardGroup';
import { RadioColor } from './RadioColor';
import { RadioControlled } from './RadioControlled';
import { RadioDisabled } from './RadioDisabled';
import { RadioGroupBasic } from './RadioGroupBasic';
import { RadioHorizontalGroup } from './RadioHorizontalGroup';
import { RadioLabelPosition } from './RadioLabelPosition';
import { RadioShape } from './RadioShape';
import { RadioSize } from './RadioSize';
import { RadioSquareGroup } from './RadioSquareGroup';

/** Radio 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/radio/RadioColor" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const RadioDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="defaultChecked 提供非受控初始值。"
        title="基础用法"
      >
        <RadioBasic />
      </Section>

      <Section
        description="color 提供与操作语义对应的主题色。"
        title="语义颜色（color）"
      >
        <RadioColor />
      </Section>

      <Section
        description="size 同时控制指示器尺寸与标签字号。"
        title="尺寸（size）"
      >
        <RadioSize />
      </Section>

      <Section
        description="shape 支持圆形和方形指示器。"
        title="形状（shape）"
      >
        <RadioShape />
      </Section>

      <Section
        description="disabled 阻止交互并降低整体透明度。"
        title="禁用状态（disabled）"
      >
        <RadioDisabled />
      </Section>

      <Section
        description="labelPosition 决定标签在左还是在右。"
        title="标签位置（labelPosition）"
      >
        <RadioLabelPosition />
      </Section>

      <Section
        description="checked 与 onCheckedChange 组成受控用法。"
        title="受控（checked / onCheckedChange）"
      >
        <RadioControlled />
      </Section>

      <Section
        description="RadioGroup 统一维护单选值，子项用 name 声明自己的取值。"
        title="分组（RadioGroup）"
      >
        <RadioGroupBasic />
      </Section>

      <Section
        description="direction='horizontal' 让分组横向排列。"
        title="横向分组（direction）"
      >
        <RadioHorizontalGroup />
      </Section>

      <Section
        description="分组级 color 与 shape 会下发给所有子项。"
        title="分组样式（color / shape）"
      >
        <RadioSquareGroup />
      </Section>

      <Section
        description="RadioCard 把图标、标题和描述组成整块可点区域。"
        title="卡片（RadioCard）"
      >
        <RadioCardBasic />
      </Section>

      <Section
        description="RadioGroupCard 用 items 一次性声明整组卡片。"
        title="卡片组（RadioGroupCard）"
      >
        <RadioCardGroup />
      </Section>
    </ScrollView>
  );
};

export { RadioDemo };
