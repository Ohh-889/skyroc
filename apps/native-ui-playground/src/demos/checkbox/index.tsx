import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { CheckboxBasic } from './CheckboxBasic';
import { CheckboxCardBasic } from './CheckboxCardBasic';
import { CheckboxCardGroup } from './CheckboxCardGroup';
import { CheckboxCardInGroup } from './CheckboxCardInGroup';
import { CheckboxColor } from './CheckboxColor';
import { CheckboxControlled } from './CheckboxControlled';
import { CheckboxCustomIcon } from './CheckboxCustomIcon';
import { CheckboxDisabled } from './CheckboxDisabled';
import { CheckboxGroupBasic } from './CheckboxGroupBasic';
import { CheckboxHorizontalGroup } from './CheckboxHorizontalGroup';
import { CheckboxIconSize } from './CheckboxIconSize';
import { CheckboxLabelPosition } from './CheckboxLabelPosition';
import { CheckboxMax } from './CheckboxMax';
import { CheckboxMultilineLabel } from './CheckboxMultilineLabel';
import { CheckboxShape } from './CheckboxShape';
import { CheckboxSize } from './CheckboxSize';
import { CheckboxSquareGroup } from './CheckboxSquareGroup';

/**
 * Checkbox 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/checkbox/CheckboxColor" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const CheckboxDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="默认非受控；checked 支持 true、false 和 indeterminate 三态。"
        title="基础用法"
      >
        <CheckboxBasic />
      </Section>

      <Section
        description="color 提供与操作语义对应的主题色。"
        title="语义颜色（color）"
      >
        <CheckboxColor />
      </Section>

      <Section
        description="size 同时控制指示器尺寸与标签字号。"
        title="尺寸（size）"
      >
        <CheckboxSize />
      </Section>

      <Section
        description="shape 支持圆形和方形指示器。"
        title="形状（shape）"
      >
        <CheckboxShape />
      </Section>

      <Section
        description="iconSize 单独指定指示器大小，内部勾随之等比缩放。"
        title="图标尺寸（iconSize）"
      >
        <CheckboxIconSize />
      </Section>

      <Section
        description="disabled 阻止交互并降低整体透明度。"
        title="禁用状态（disabled）"
      >
        <CheckboxDisabled />
      </Section>

      <Section
        description="labelPosition 决定标签在左还是在右；labelDisabled 让标签不可点。"
        title="标签位置（labelPosition / labelDisabled）"
      >
        <CheckboxLabelPosition />
      </Section>

      <Section
        description="标签换行时指示器贴首行，而不是整块垂直居中。"
        title="多行标签"
      >
        <CheckboxMultilineLabel />
      </Section>

      <Section
        description="checked 与 onCheckedChange 组成受控用法。"
        title="受控（checked / onCheckedChange）"
      >
        <CheckboxControlled />
      </Section>

      <Section
        description="CheckboxGroup 统一维护选中值；子项 onCheckedChange 在分组内同样会触发。"
        title="分组（CheckboxGroup）"
      >
        <CheckboxGroupBasic />
      </Section>

      <Section
        description="max 限制最多可选数量，达到上限后未选项不再响应。"
        title="数量上限（max）"
      >
        <CheckboxMax />
      </Section>

      <Section
        description="direction='horizontal' 让分组横向排列。"
        title="横向分组（direction）"
      >
        <CheckboxHorizontalGroup />
      </Section>

      <Section
        description="分组级 color 与 shape 会下发给所有子项。"
        title="分组样式（color / shape）"
      >
        <CheckboxSquareGroup />
      </Section>

      <Section
        description="checkedIcon 和 indeterminateIcon 可替换内置勾选图标。"
        title="自定义图标（checkedIcon / indeterminateIcon）"
      >
        <CheckboxCustomIcon />
      </Section>

      <Section
        description="CheckboxCard 把图标、标题和描述组成整块可点区域。"
        title="卡片（CheckboxCard）"
      >
        <CheckboxCardBasic />
      </Section>

      <Section
        description="CheckboxCard 直接放进 CheckboxGroup，与 Checkbox 共享同一份选中态。"
        title="卡片入组（CheckboxCard + CheckboxGroup）"
      >
        <CheckboxCardInGroup />
      </Section>

      <Section
        description="CheckboxGroupCard 用 items 一次性声明整组卡片。"
        title="卡片组（CheckboxGroupCard）"
      >
        <CheckboxCardGroup />
      </Section>
    </ScrollView>
  );
};

export { CheckboxDemo };
