import { Button, RollingText, Text } from '@skyroc/native-ui';
import type { RollingTextRef } from '@skyroc/native-ui';
import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

const TEXT_LIST = ['Hello', 'World', 'React', 'Skyroc'];

const RollingTextDemo = () => {
  const manualRef = useRef<RollingTextRef>(null);

  const [amount, setAmount] = useState(1234);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* Basic */}
      <Text className="mb-4 text-lg font-semibold">Basic</Text>
      <View className="mb-8">
        <RollingText targetNum={4321} />
      </View>

      {/* Direction */}
      <Text className="mb-4 text-lg font-semibold">Direction</Text>
      <View className="mb-8 gap-4">
        <View className="flex-row items-center gap-3">
          <Text className="w-14 text-sm text-muted-foreground">down</Text>
          <RollingText
            direction="down"
            targetNum={2024}
          />
        </View>
        <View className="flex-row items-center gap-3">
          <Text className="w-14 text-sm text-muted-foreground">up</Text>
          <RollingText
            direction="up"
            targetNum={2024}
          />
        </View>
      </View>

      {/* Stop order */}
      <Text className="mb-4 text-lg font-semibold">Stop Order</Text>
      <View className="mb-8 gap-4">
        <View className="flex-row items-center gap-3">
          <Text className="w-14 text-sm text-muted-foreground">ltr</Text>
          <RollingText
            stopOrder="ltr"
            targetNum={87654}
          />
        </View>
        <View className="flex-row items-center gap-3">
          <Text className="w-14 text-sm text-muted-foreground">rtl</Text>
          <RollingText
            stopOrder="rtl"
            targetNum={87654}
          />
        </View>
      </View>

      {/* Start from */}
      <Text className="mb-4 text-lg font-semibold">Start From</Text>
      <View className="mb-8">
        <RollingText
          startNum={12}
          targetNum={99}
        />
      </View>

      {/* Text mode */}
      <Text className="mb-4 text-lg font-semibold">Text Mode</Text>
      <View className="mb-8">
        {/* 各项长度不等，列数按最长的 Skyroc 取 6 列 */}
        <RollingText
          duration={2500}
          textList={TEXT_LIST}
        />
      </View>

      {/* Custom style */}
      <Text className="mb-4 text-lg font-semibold">Custom Style</Text>
      <View className="mb-8 gap-4">
        <RollingText
          height={28}
          targetNum={520}
          textClassName="text-xl font-bold text-primary"
        />
        <RollingText
          height={56}
          targetNum={1314}
          textClassName="text-4xl font-black text-destructive"
        />
      </View>

      {/* Timing */}
      <Text className="mb-4 text-lg font-semibold">Timing</Text>
      <View className="mb-8 gap-4">
        <View className="flex-row items-center gap-3">
          <Text className="w-24 text-sm text-muted-foreground">fast</Text>
          <RollingText
            delayStep={80}
            duration={800}
            targetNum={9999}
          />
        </View>
        <View className="flex-row items-center gap-3">
          <Text className="w-24 text-sm text-muted-foreground">no stagger</Text>
          <RollingText
            delayStep={0}
            duration={3000}
            targetNum={9999}
          />
        </View>
      </View>

      {/* Manual control */}
      <Text className="mb-4 text-lg font-semibold">Manual Control</Text>
      <View className="mb-8 gap-4">
        <RollingText
          ref={manualRef}
          autoStart={false}
          targetNum={666}
        />
        <View className="flex-row flex-wrap gap-3">
          <Button
            color="primary"
            variant="solid"
            onPress={() => manualRef.current?.start()}
          >
            Start
          </Button>
          <Button
            color="secondary"
            variant="outline"
            onPress={() => manualRef.current?.reset()}
          >
            Reset
          </Button>
        </View>
      </View>

      {/* Dynamic target */}
      <Text className="mb-4 text-lg font-semibold">Dynamic Target</Text>
      <View className="mb-8 gap-4">
        {/* 目标值变化时无需手动 start，位数变或不变都会重新滚动 */}
        <RollingText targetNum={amount} />
        <View className="flex-row flex-wrap gap-3">
          <Button
            color="primary"
            variant="tonal"
            onPress={() => setAmount(value => value + 1111)}
          >
            +1111
          </Button>
          <Button
            color="primary"
            variant="tonal"
            onPress={() => setAmount(88)}
          >
            Set 88
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export { RollingTextDemo };
