import { Button, RollingText, Text } from '@skyroc/native-ui';
import type { RollingTextRef } from '@skyroc/native-ui';
import { useRef } from 'react';
import { ScrollView, View } from 'react-native';

const RollingTextDemo = () => {
  const rollingRef = useRef<RollingTextRef>(null);
  const textRollingRef = useRef<RollingTextRef>(null);

  return (
    <ScrollView
      className="flex-1 bg-muted"
      contentContainerClassName="pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* Basic */}
      <Text className="px-4 py-3 text-sm text-muted-foreground">Basic</Text>
      <View className="bg-background items-center px-4 py-6">
        <RollingText
          startNum={0}
          targetNum={123}
        />
      </View>

      {/* Direction Up */}
      <Text className="px-4 py-3 text-sm text-muted-foreground">Direction Up</Text>
      <View className="bg-background items-center px-4 py-6">
        <RollingText
          direction="up"
          startNum={0}
          targetNum={456}
        />
      </View>

      {/* Stop Order RTL */}
      <Text className="px-4 py-3 text-sm text-muted-foreground">Stop Order (RTL)</Text>
      <View className="bg-background items-center px-4 py-6">
        <RollingText
          startNum={0}
          stopOrder="rtl"
          targetNum={789}
        />
      </View>

      {/* Custom Duration */}
      <Text className="px-4 py-3 text-sm text-muted-foreground">Custom Duration (3s)</Text>
      <View className="bg-background items-center px-4 py-6">
        <RollingText
          duration={3000}
          startNum={0}
          targetNum={9999}
        />
      </View>

      {/* Text Mode */}
      <Text className="px-4 py-3 text-sm text-muted-foreground">Text Mode</Text>
      <View className="bg-background items-center px-4 py-6">
        <RollingText
          ref={textRollingRef}
          textList={['AAA', 'BBB', 'CCC', 'DDD', 'EEE']}
        />
        <View className="mt-3 flex-row gap-2">
          <Button
            size="sm"
            variant="outline"
            onPress={() => textRollingRef.current?.reset()}
          >
            Reset
          </Button>
        </View>
      </View>

      {/* Manual Control */}
      <Text className="px-4 py-3 text-sm text-muted-foreground">Manual Control</Text>
      <View className="bg-background items-center px-4 py-6">
        <RollingText
          ref={rollingRef}
          autoStart={false}
          startNum={0}
          targetNum={5678}
        />
        <View className="mt-3 flex-row gap-2">
          <Button
            size="sm"
            onPress={() => rollingRef.current?.start()}
          >
            Start
          </Button>
          <Button
            size="sm"
            variant="outline"
            onPress={() => rollingRef.current?.reset()}
          >
            Reset
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export { RollingTextDemo };
