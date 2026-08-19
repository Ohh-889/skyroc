import { Text } from '@skyroc/native-ui';
import { ScrollView } from 'react-native';
import { StepperBasic } from './StepperBasic';
import { StepperBeforeChange } from './StepperBeforeChange';
import { StepperControlled } from './StepperControlled';
import { StepperDecimal } from './StepperDecimal';
import { StepperDisabled } from './StepperDisabled';
import { StepperEmpty } from './StepperEmpty';
import { StepperEvents } from './StepperEvents';
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
      contentContainerClassName="pt-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 px-6 text-lg font-semibold">基础用法</Text>
      <StepperBasic />

      {/* 尺寸 */}
      <Text className="mb-4 px-6 text-lg font-semibold">尺寸</Text>
      <StepperSize />

      {/* 主题 */}
      <Text className="mb-4 px-6 text-lg font-semibold">主题</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        default 是连体式，round 是两枚圆钮 + 无底色输入框
      </Text>
      <StepperTheme />

      {/* 步长与范围 */}
      <Text className="mb-4 px-6 text-lg font-semibold">步长与范围</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        min 2 / max 10 / step 2，超出范围的输入失焦后被夹回边界
      </Text>
      <StepperRange />

      {/* 小数与整数 */}
      <Text className="mb-4 px-6 text-lg font-semibold">小数与整数</Text>
      <StepperDecimal />

      {/* 事件 */}
      <Text className="mb-4 px-6 text-lg font-semibold">事件</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        已在边界仍点击时只发 onOverlimit，不会再发 onMinus / onPlus
      </Text>
      <StepperEvents />

      {/* 禁用 */}
      <Text className="mb-4 px-6 text-lg font-semibold">禁用</Text>
      <StepperDisabled />

      {/* 按需显示 */}
      <Text className="mb-4 px-6 text-lg font-semibold">按需显示</Text>
      <StepperVisibility />

      {/* 长按连续触发 */}
      <Text className="mb-4 px-6 text-lg font-semibold">长按连续触发</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        按住 600ms 后每 150ms 触发一次，到边界自动停；长按结束时不会多跳一步
      </Text>
      <StepperLongPress />

      {/* 异步拦截 */}
      <Text className="mb-4 px-6 text-lg font-semibold">异步拦截</Text>
      <StepperBeforeChange />

      {/* 空值与自动修正 */}
      <Text className="mb-4 px-6 text-lg font-semibold">空值与自动修正</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        allowEmpty 允许清空后保留空串；autoFixed=false 时失焦保留原始输入，既不修正也不提交
      </Text>
      <StepperEmpty />

      {/* 自定义样式 */}
      <Text className="mb-4 px-6 text-lg font-semibold">自定义样式</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        className 覆盖根容器，classNames 细粒度覆盖各 slot
      </Text>
      <StepperStyles />

      {/* 受控 */}
      <Text className="mb-4 px-6 text-lg font-semibold">受控</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        外部改值后输入框同步刷新；父级不更新 value 时界面也不会自己走
      </Text>
      <StepperControlled />
    </ScrollView>
  );
};

export { StepperDemo };
