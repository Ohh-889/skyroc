import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { StepperBasic } from './StepperBasic';
import { StepperBeforeChange } from './StepperBeforeChange';
import { StepperControlled } from './StepperControlled';
import { StepperDecimal } from './StepperDecimal';
import { StepperDisabled } from './StepperDisabled';
import { StepperEmpty } from './StepperEmpty';
import { StepperEvents } from './StepperEvents';
import { StepperInputEvents } from './StepperInputEvents';
import { StepperLongPress } from './StepperLongPress';
import { StepperRange } from './StepperRange';
import { StepperSize } from './StepperSize';
import { StepperStyles } from './StepperStyles';
import { StepperTheme } from './StepperTheme';
import { StepperVisibility } from './StepperVisibility';

/** Stepper 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/stepper/StepperRange" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const StepperDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="value 与 onChange 组成受控步进器；默认范围从 1 到安全整数上限。"
        title="基础用法（value / onChange）"
      >
        <StepperBasic />
      </Section>

      <Section
        description="size 提供 sm、md、lg 三档，按钮、输入框和字号同步变化。"
        title="尺寸（size）"
      >
        <StepperSize />
      </Section>

      <Section
        description="default 是连体式，round 是两枚圆形按钮与无底色输入框。"
        title="外观主题（theme）"
      >
        <StepperTheme />
      </Section>

      <Section
        description="min / max 限定边界，step 决定每次加减的数值；输入失焦后同样会夹回范围。"
        title="步长与范围（min / max / step）"
      >
        <StepperRange />
      </Section>

      <Section
        description="decimalLength 固定小数位，integer 强制整数；浮点步长会消除累加尾数。"
        title="数值精度（decimalLength / integer）"
      >
        <StepperDecimal />
      </Section>

      <Section
        description="已在边界仍点击时只触发 onOverlimit，不再触发 onMinus / onPlus。"
        title="按钮事件（onMinus / onPlus / onOverlimit）"
      >
        <StepperEvents />
      </Section>

      <Section
        description="ref 透传到底层 TextInput；onChangeText 反馈编辑文本，onBlur 提交并归一化数值。"
        title="输入框事件与 ref"
      >
        <StepperInputEvents />
      </Section>

      <Section
        description="disabled 禁用整体，也可分别禁用输入框、减少按钮或增加按钮。"
        title="禁用状态（disabled / disableInput / disableMinus / disablePlus）"
      >
        <StepperDisabled />
      </Section>

      <Section
        description="showInput、showMinus、showPlus 分别控制三个组成部分是否渲染。"
        title="按需显示"
      >
        <StepperVisibility />
      </Section>

      <Section
        description="默认按住 600ms 后连续触发，到边界自动停止；longPress=false 只响应单击。"
        title="长按连续触发（longPress）"
      >
        <StepperLongPress />
      </Section>

      <Section
        description="beforeChange 支持同步或异步返回 false 拒绝新值，异步等待期间不会重复步进。"
        title="变化前拦截（beforeChange）"
      >
        <StepperBeforeChange />
      </Section>

      <Section
        description="allowEmpty 保留空输入；autoFixed=false 时失焦保留原文，既不修正也不提交。"
        title="空值与自动修正"
      >
        <StepperEmpty />
      </Section>

      <Section
        description="className 覆盖根容器，classNames 可覆盖输入框、按钮和加减图标。"
        title="样式覆盖（className / classNames）"
      >
        <StepperStyles />
      </Section>

      <Section
        description="外部按钮与 Stepper 共享 value，父级拒绝更新时组件不会自行改变显示值。"
        title="外部控制（value）"
      >
        <StepperControlled />
      </Section>
    </ScrollView>
  );
};

export { StepperDemo };
