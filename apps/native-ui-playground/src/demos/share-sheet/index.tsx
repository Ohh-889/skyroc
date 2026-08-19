import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { ShareSheetBasic } from './ShareSheetBasic';
import { ShareSheetCloseBehavior } from './ShareSheetCloseBehavior';
import { ShareSheetDescription } from './ShareSheetDescription';
import { ShareSheetEvents } from './ShareSheetEvents';
import { ShareSheetImperative } from './ShareSheetImperative';
import { ShareSheetMultiRow } from './ShareSheetMultiRow';
import { ShareSheetStyles } from './ShareSheetStyles';
import { ShareSheetUncontrolled } from './ShareSheetUncontrolled';

/**
 * ShareSheet 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/share-sheet/ShareSheetMultiRow"
 * />），所以这里只负责串场，不要把示例代码写回本文件。
 */
const ShareSheetDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="一维 options 即单行，show 与 onUpdateShow 组成受控显示，选项超出宽度可以横向滚动。"
        title="基础用法（show / options）"
      >
        <ShareSheetBasic />
      </Section>

      <Section
        description="defaultShow 设置非受控初始显示状态，后续显隐由组件内部维护。"
        title="非受控显示（defaultShow）"
      >
        <ShareSheetUncontrolled />
      </Section>

      <Section
        description="二维 options 按行渲染，onSelect 会带上行下标。"
        title="多行展示（options）"
      >
        <ShareSheetMultiRow />
      </Section>

      <Section
        description="面板和每个选项都可以显示描述信息。"
        title="描述信息（description）"
      >
        <ShareSheetDescription />
      </Section>

      <Section
        description="onSelect、onCancel 记录用户动作；onClosed 在退场动画完成后触发。"
        title="事件（onSelect / onCancel / onClosed）"
      >
        <ShareSheetEvents />
      </Section>

      <Section
        description="可分别关闭顶部按钮、遮罩点击、下拉手势和拖拽指示条；ref 透传底层面板实例。"
        title="关闭行为与 ref"
      >
        <ShareSheetCloseBehavior />
      </Section>

      <Section
        description="className / classNames 定制内容与选项，sheetClassName / sheetClassNames 定制面板；name 和 description 支持节点。"
        title="自定义内容与样式"
      >
        <ShareSheetStyles />
      </Section>

      <Section
        description="showShareSheet 的 Promise 与 callback 都会结算；closeShareSheet 可从外部关闭。"
        title="命令式调用（showShareSheet）"
      >
        <ShareSheetImperative />
      </Section>
    </ScrollView>
  );
};

export { ShareSheetDemo };
