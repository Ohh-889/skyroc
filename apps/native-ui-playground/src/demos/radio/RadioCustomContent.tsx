import Feather from '@expo/vector-icons/Feather';
import { Radio, RadioCard, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const RadioCustomContent = () => {
  return (
    <View className="gap-4 bg-background p-4">
      <Radio defaultChecked>
        <View className="flex-row items-center gap-2">
          <Text className="font-medium text-foreground">自定义标签</Text>
          <Text className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">推荐</Text>
        </View>
      </Radio>
      <RadioCard
        defaultChecked
        description={<Text className="text-xs text-success">可用状态</Text>}
        icon={
          <Feather
            color="var(--primary)"
            name="zap"
            size={20}
          />
        }
        label={<Text className="font-semibold text-primary">自定义卡片内容</Text>}
      />
    </View>
  );
};

export { RadioCustomContent };
