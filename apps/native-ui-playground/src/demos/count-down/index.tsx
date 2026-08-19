import { Text } from '@skyroc/native-ui';
import { ScrollView, View } from 'react-native';
import { CountDownBasic } from './CountDownBasic';
import { CountDownCustomRender } from './CountDownCustomRender';
import { CountDownDynamicTime } from './CountDownDynamicTime';
import { CountDownFinish } from './CountDownFinish';
import { CountDownFormat } from './CountDownFormat';
import { CountDownManual } from './CountDownManual';
import { CountDownMillisecond } from './CountDownMillisecond';
import { CountDownSms } from './CountDownSms';
import { CountDownStyles } from './CountDownStyles';

/** CountDown 的总览页，逐节复用同目录下的单点 demo，本文件只负责串场。 */
const CountDownDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="py-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 px-6 text-lg font-semibold">基础用法</Text>
      <View className="mb-4">
        <CountDownBasic />
      </View>

      {/* 自定义格式 */}
      <Text className="mb-4 px-6 text-lg font-semibold">自定义格式</Text>
      <View className="mb-4">
        <CountDownFormat />
      </View>

      {/* 毫秒级 */}
      <Text className="mb-4 px-6 text-lg font-semibold">毫秒级</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        每帧刷新，仅在需要毫秒精度时开启
      </Text>
      <View className="mb-4">
        <CountDownMillisecond />
      </View>

      {/* 自定义样式 */}
      <Text className="mb-4 px-6 text-lg font-semibold">自定义样式</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        className 覆盖根容器，classNames 细粒度覆盖各 slot
      </Text>
      <View className="mb-4">
        <CountDownStyles />
      </View>

      {/* 自定义渲染 */}
      <Text className="mb-4 px-6 text-lg font-semibold">自定义渲染</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        children 只接管文本，根容器照常渲染，className 依旧生效
      </Text>
      <View className="mb-4">
        <CountDownCustomRender />
      </View>

      {/* 手动控制 */}
      <Text className="mb-4 px-6 text-lg font-semibold">手动控制</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        autoStart={'{false}'} 时由 ref 驱动，reset 不会自动重开
      </Text>
      <View className="mb-4">
        <CountDownManual />
      </View>

      {/* 动态时长 */}
      <Text className="mb-4 px-6 text-lg font-semibold">动态时长</Text>
      <Text
        className="mb-2 px-6"
        color="muted"
      >
        计时过程中改 time，应当立刻按新时长重新开始
      </Text>
      <View className="mb-4">
        <CountDownDynamicTime />
      </View>

      {/* 结束回调 */}
      <Text className="mb-4 px-6 text-lg font-semibold">结束回调</Text>
      <View className="mb-4">
        <CountDownFinish />
      </View>

      {/* 验证码场景 */}
      <Text className="mb-4 px-6 text-lg font-semibold">验证码场景</Text>
      <View className="mb-4">
        <CountDownSms />
      </View>
    </ScrollView>
  );
};

export { CountDownDemo };
