import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { ButtonBasic } from './ButtonBasic';
import { ButtonBlock } from './ButtonBlock';
import { ButtonColor } from './ButtonColor';
import { ButtonCustomContent } from './ButtonCustomContent';
import { ButtonDisabled } from './ButtonDisabled';
import { ButtonInteraction } from './ButtonInteraction';
import { ButtonLoading } from './ButtonLoading';
import { ButtonShape } from './ButtonShape';
import { ButtonSize } from './ButtonSize';
import { ButtonSlot } from './ButtonSlot';
import { ButtonStyles } from './ButtonStyles';
import { ButtonVariant } from './ButtonVariant';

/** Button 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/button/ButtonColor" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const ButtonDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="默认使用 primary、solid、md 和 rounded。"
        title="基础用法"
      >
        <ButtonBasic />
      </Section>

      <Section
        description="通过 variant 调整按钮的视觉强度。"
        title="视觉变体（variant）"
      >
        <ButtonVariant />
      </Section>

      <Section
        description="color 提供与操作语义对应的主题色。"
        title="语义颜色（color）"
      >
        <ButtonColor />
      </Section>

      <Section
        description="size 同时控制高度、文字和内容间距。"
        title="尺寸（size）"
      >
        <ButtonSize />
      </Section>

      <Section
        description="shape 支持标准圆角、药丸和正圆。"
        title="形状（shape）"
      >
        <ButtonShape />
      </Section>

      <Section
        description="block 让按钮占满父容器宽度。"
        title="通栏（block）"
      >
        <ButtonBlock />
      </Section>

      <Section
        description="leading 和 trailing 分别放置前置、后置内容。"
        title="前后内容（leading / trailing）"
      >
        <ButtonSlot />
      </Section>

      <Section
        description="children 可传文字、数字或任意 React 节点。"
        title="自定义内容（children）"
      >
        <ButtonCustomContent />
      </Section>

      <Section
        description="className 覆盖容器，classNames 可精细控制 root 和 text。"
        title="样式覆盖（className / classNames）"
      >
        <ButtonStyles />
      </Section>

      <Section
        description="底层 Pressable 的点击和长按事件会原样透传。"
        title="交互（onPress / onLongPress）"
      >
        <ButtonInteraction />
      </Section>

      <Section
        description="loading 显示指示器，并在加载期间自动禁用。"
        title="加载状态（loading）"
      >
        <ButtonLoading />
      </Section>

      <Section
        description="disabled 会阻止交互并降低按钮透明度。"
        title="禁用状态（disabled）"
      >
        <ButtonDisabled />
      </Section>
    </ScrollView>
  );
};

export { ButtonDemo };
