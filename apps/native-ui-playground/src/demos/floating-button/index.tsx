import { Button, Text } from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Section } from '@/src/components/Section';
import { FloatingButtonAxis } from './FloatingButtonAxis';
import { FloatingButtonBasic } from './FloatingButtonBasic';
import { FloatingButtonDisabled } from './FloatingButtonDisabled';
import { FloatingButtonMagnetic } from './FloatingButtonMagnetic';
import { FloatingButtonOffset } from './FloatingButtonOffset';
import { FloatingButtonSize } from './FloatingButtonSize';
import { FloatingButtonVisible } from './FloatingButtonVisible';

type FloatingButtonDemoType = 'axis' | 'basic' | 'disabled' | 'magnetic' | 'offset' | 'size' | 'visible';

interface DemoPreviewProps {
  /** 当前是否展示这一项的全屏悬浮按钮 */
  active: boolean;
  /** 激活后展示的单点 Demo */
  children: ReactNode;
  /** 激活当前示例并卸载上一项 */
  onActivate: () => void;
}

/** FloatingButton 必须使用全屏坐标，因此总览一次只挂载一个悬浮实例，避免多个 Portal 互相遮挡 */
const DemoPreview = (props: DemoPreviewProps) => {
  const { active, children, onActivate } = props;

  if (active) return children;

  return (
    <View className="items-start bg-background p-4">
      <Button
        size="sm"
        variant="outline"
        onPress={onActivate}
      >
        体验此示例
      </Button>
    </View>
  );
};

/**
 * FloatingButton 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/floating-button/FloatingButtonMagnetic"
 * />）， 所以这里只负责串场，不要把示例代码写回本文件。
 */
const FloatingButtonDemo = () => {
  const [activeDemo, setActiveDemo] = useState<FloatingButtonDemoType>('basic');

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-24"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="组件按窗口尺寸计算边界，必须挂在与屏幕同尺寸、同原点的容器中；本页通过 Portal 放到全屏 PortalHost。"
        title="坐标系约定"
      >
        <Text className="p-4 text-sm leading-5 text-muted-foreground">
          总览一次只激活一个示例。切换示例时会卸载上一个 Portal，避免多个悬浮按钮遮挡内容。
        </Text>
      </Section>

      <Section
        description="默认 axis='y'，按钮可纵向拖动；onPress 与拖拽手势互斥。"
        title="基础点击 · onPress"
      >
        <DemoPreview
          active={activeDemo === 'basic'}
          onActivate={() => setActiveDemo('basic')}
        >
          <FloatingButtonBasic />
        </DemoPreview>
      </Section>

      <Section
        description="axis 支持 x、y、xy 与 lock，分别限制横向、纵向、自由拖拽或完全锁定。"
        title="拖拽方向 · axis"
      >
        <DemoPreview
          active={activeDemo === 'axis'}
          onActivate={() => setActiveDemo('axis')}
        >
          <FloatingButtonAxis />
        </DemoPreview>
      </Section>

      <Section
        description="offset / onOffsetChange 组成受控位置；gap 可分别约束横纵方向的最小边距。"
        title="受控位置与边距"
      >
        <DemoPreview
          active={activeDemo === 'offset'}
          onActivate={() => setActiveDemo('offset')}
        >
          <FloatingButtonOffset />
        </DemoPreview>
      </Section>

      <Section
        description="magnetic='x' 吸附左右边缘，magnetic='y' 吸附上下边缘；onOffsetChange 返回吸附终点。"
        title="边缘吸附 · magnetic"
      >
        <DemoPreview
          active={activeDemo === 'magnetic'}
          onActivate={() => setActiveDemo('magnetic')}
        >
          <FloatingButtonMagnetic />
        </DemoPreview>
      </Section>

      <Section
        description="visible 可接收 boolean 或 SharedValue<boolean>；本例使用 SharedValue 在 UI 线程切换缩放显隐。"
        title="显隐 · visible"
      >
        <DemoPreview
          active={activeDemo === 'visible'}
          onActivate={() => setActiveDemo('visible')}
        >
          <FloatingButtonVisible />
        </DemoPreview>
      </Section>

      <Section
        description="disabled 会同时阻止点击与拖拽，并降低整体不透明度。"
        title="禁用 · disabled"
      >
        <DemoPreview
          active={activeDemo === 'disabled'}
          onActivate={() => setActiveDemo('disabled')}
        >
          <FloatingButtonDisabled />
        </DemoPreview>
      </Section>

      <Section
        description="size 控制直径，children 提供内容，className 覆盖默认背景与形状样式。"
        title="尺寸与自定义内容"
      >
        <DemoPreview
          active={activeDemo === 'size'}
          onActivate={() => setActiveDemo('size')}
        >
          <FloatingButtonSize />
        </DemoPreview>
      </Section>
    </ScrollView>
  );
};

export { FloatingButtonDemo };
