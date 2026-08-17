import { Button, CountDown, Text } from '@skyroc/native-ui';
import type { CountDownRef } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

const DURATIONS = [10, 30, 60];

const SMS_SECONDS = 60;

const CountDownDemo = () => {
  const [duration, setDuration] = useState(30);
  const [finishCount, setFinishCount] = useState(0);
  const [smsSending, setSmsSending] = useState(false);

  const manualRef = useRef<CountDownRef>(null);

  function handleReset() {
    manualRef.current?.reset();
  }

  function handleResetTo(seconds: number) {
    manualRef.current?.reset(seconds * 1000);
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-4 text-lg font-semibold">基础用法</Text>
      <View className="mb-8">
        <CountDown time={60 * 1000} />
      </View>

      {/* 自定义格式 */}
      <Text className="mb-4 text-lg font-semibold">自定义格式</Text>
      <View className="mb-8 gap-2">
        <CountDown
          format="DD 天 HH 时 mm 分 ss 秒"
          time={30 * 60 * 60 * 1000}
        />
        <CountDown
          format="mm:ss"
          time={90 * 1000}
        />
      </View>

      {/* 毫秒级 */}
      <Text className="mb-4 text-lg font-semibold">毫秒级</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        每帧刷新，仅在需要毫秒精度时开启
      </Text>
      <View className="mb-8 gap-2">
        <CountDown
          millisecond
          format="ss:SS"
          time={10 * 1000}
        />
        {/* 缺失的高位单位会并入低位：只有 SSS 时，10 秒显示为 10000 起的总毫秒数 */}
        <CountDown
          millisecond
          format="SSS 毫秒"
          time={10 * 1000}
        />
      </View>

      {/* 自定义样式 */}
      <Text className="mb-4 text-lg font-semibold">自定义样式</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        className 覆盖根容器，classNames 细粒度覆盖各 slot
      </Text>
      <View className="mb-8 gap-3">
        <CountDown
          className="items-center rounded-lg bg-secondary py-3"
          time={60 * 1000}
        />
        <CountDown
          classNames={{
            root: 'items-center rounded-lg border border-primary py-3',
            text: 'text-2xl font-semibold text-primary'
          }}
          time={60 * 1000}
        />
      </View>

      {/* 自定义渲染 */}
      <Text className="mb-4 text-lg font-semibold">自定义渲染</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        children 只接管文本，根容器照常渲染，className 依旧生效
      </Text>
      <View className="mb-8">
        <CountDown
          className="flex-row items-center gap-2 rounded-lg bg-muted p-3"
          time={60 * 60 * 1000}
        >
          {current => (
            <>
              <Text className="rounded bg-primary px-2 py-1 text-primary-foreground">{current.hours}</Text>
              <Text className="text-primary">:</Text>
              <Text className="rounded bg-primary px-2 py-1 text-primary-foreground">{current.minutes}</Text>
              <Text className="text-primary">:</Text>
              <Text className="rounded bg-primary px-2 py-1 text-primary-foreground">{current.seconds}</Text>
            </>
          )}
        </CountDown>
      </View>

      {/* 手动控制 */}
      <Text className="mb-4 text-lg font-semibold">手动控制</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        autoStart={'{false}'} 时由 ref 驱动，reset 不会自动重开
      </Text>
      <View className="mb-4">
        <CountDown
          autoStart={false}
          format="mm:ss:SSS"
          millisecond
          ref={manualRef}
          time={20 * 1000}
        />
      </View>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => manualRef.current?.start()}
        >
          开始
        </Button>
        <Button
          variant="tonal"
          onPress={() => manualRef.current?.pause()}
        >
          暂停
        </Button>
        <Button
          variant="outline"
          onPress={handleReset}
        >
          重置
        </Button>
        <Button
          variant="outline"
          onPress={() => handleResetTo(5)}
        >
          重置为 5 秒
        </Button>
      </View>

      {/* 动态时长 */}
      <Text className="mb-4 text-lg font-semibold">动态时长</Text>
      <Text
        className="mb-2"
        color="muted"
      >
        计时过程中改 time，应当立刻按新时长重新开始
      </Text>
      <View className="mb-4">
        <CountDown
          format="mm:ss"
          time={duration * 1000}
        />
      </View>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        {DURATIONS.map(seconds => (
          <Button
            key={seconds}
            variant={seconds === duration ? 'solid' : 'tonal'}
            onPress={() => setDuration(seconds)}
          >
            {`${seconds} 秒`}
          </Button>
        ))}
      </View>

      {/* 结束回调 */}
      <Text className="mb-4 text-lg font-semibold">结束回调</Text>
      <View className="mb-2">
        <CountDown
          format="ss"
          time={5 * 1000}
          onFinish={() => setFinishCount(prev => prev + 1)}
        />
      </View>
      <Text
        className="mb-8"
        color="muted"
      >
        onFinish 已触发 {finishCount} 次（每轮只应 +1，切后台再回来也不应重复）
      </Text>

      {/* 验证码场景 */}
      <Text className="mb-4 text-lg font-semibold">验证码场景</Text>
      <View className="mb-8 flex-row items-center gap-3">
        <Button
          disabled={smsSending}
          variant="solid"
          onPress={() => setSmsSending(true)}
        >
          {smsSending ? '重新发送' : '发送验证码'}
        </Button>
        {smsSending ? (
          <CountDown
            time={SMS_SECONDS * 1000}
            onFinish={() => setSmsSending(false)}
          >
            {current => <Text color="muted">{current.seconds} 秒后可重发</Text>}
          </CountDown>
        ) : null}
      </View>
    </ScrollView>
  );
};

export { CountDownDemo };
