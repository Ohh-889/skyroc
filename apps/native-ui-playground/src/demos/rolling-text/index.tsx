import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { RollingTextBasic } from './RollingTextBasic';
import { RollingTextDirection } from './RollingTextDirection';
import { RollingTextDuration } from './RollingTextDuration';
import { RollingTextDynamic } from './RollingTextDynamic';
import { RollingTextManual } from './RollingTextManual';
import { RollingTextStopOrder } from './RollingTextStopOrder';
import { RollingTextStyles } from './RollingTextStyles';
import { RollingTextTextMode } from './RollingTextTextMode';

/** RollingText 的总览页，逐节复用同目录下的单点 demo，本文件只负责串场。 */
const RollingTextDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="startNum 指定首轮起点，targetNum 指定目标数字；默认挂载后自动播放。"
        title="基础用法（startNum / targetNum）"
      >
        <RollingTextBasic />
      </Section>

      <Section
        description="direction 控制字符向下或向上滚入，两种方向的目标值计算一致。"
        title="滚动方向（direction）"
      >
        <RollingTextDirection />
      </Section>

      <Section
        description="stopOrder 与 delayStep 共同决定各列从左到右或从右到左依次落定。"
        title="停止顺序（stopOrder / delayStep）"
      >
        <RollingTextStopOrder />
      </Section>

      <Section
        description="circles 控制额外空转圈数，duration 控制单列时长，height 控制字符行高。"
        title="动画节奏（circles / duration / height）"
      >
        <RollingTextDuration />
      </Section>

      <Section
        description="textList 开启文本模式；空文本与不同长度文本会按最长项补齐列数。"
        title="文本模式（textList）"
      >
        <RollingTextTextMode />
      </Section>

      <Section
        description="autoStart=false 时通过 ref.start / reset 控制播放，完整落定后触发一次 onFinish。"
        title="手动控制与完成事件（autoStart / ref / onFinish）"
      >
        <RollingTextManual />
      </Section>

      <Section
        description="targetNum 改变后从上一轮终点继续滚动，位数增加或减少时会重建列。"
        title="动态目标值（targetNum）"
      >
        <RollingTextDynamic />
      </Section>

      <Section
        description="className 覆盖根容器，classNames.text 调整每个滚动字符。"
        title="样式覆盖（className / classNames）"
      >
        <RollingTextStyles />
      </Section>
    </ScrollView>
  );
};

export { RollingTextDemo };
