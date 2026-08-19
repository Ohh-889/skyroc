import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { CountDownBasic } from './CountDownBasic';
import { CountDownCustomRender } from './CountDownCustomRender';
import { CountDownDynamicTime } from './CountDownDynamicTime';
import { CountDownFinish } from './CountDownFinish';
import { CountDownFormat } from './CountDownFormat';
import { CountDownManual } from './CountDownManual';
import { CountDownMillisecond } from './CountDownMillisecond';
import { CountDownStyles } from './CountDownStyles';

/** CountDown 的总览页，逐节复用同目录下的单点 demo，本文件只负责串场。 */
const CountDownDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="传入毫秒数即可开始倒计时；time=0 会稳定显示零值。"
        title="基础用法（time）"
      >
        <CountDownBasic />
      </Section>

      <Section
        description="format 支持 DD、HH、mm、ss；省略高位单位时会向低位累加。"
        title="格式化（format）"
      >
        <CountDownFormat />
      </Section>

      <Section
        description="millisecond 开启每帧刷新，S、SS、SSS 分别展示十分秒、百分秒和毫秒。"
        title="毫秒精度（millisecond）"
      >
        <CountDownMillisecond />
      </Section>

      <Section
        description="className 覆盖根容器，classNames 可分别覆盖 root 和 text。"
        title="样式覆盖（className / classNames）"
      >
        <CountDownStyles />
      </Section>

      <Section
        description="函数式 children 接收 current，并只替换默认文本内容。"
        title="自定义内容（children）"
      >
        <CountDownCustomRender />
      </Section>

      <Section
        description="autoStart=false 时，可通过 ref 调用 start、pause 和 reset。"
        title="手动控制（autoStart / ref）"
      >
        <CountDownManual />
      </Section>

      <Section
        description="计时过程中改变 time，会立即按新的总时长重新开始。"
        title="动态时长（time）"
      >
        <CountDownDynamicTime />
      </Section>

      <Section
        description="onChange 在剩余时间更新时触发，onFinish 在每轮归零时触发一次。"
        title="事件回调（onChange / onFinish）"
      >
        <CountDownFinish />
      </Section>
    </ScrollView>
  );
};

export { CountDownDemo };
