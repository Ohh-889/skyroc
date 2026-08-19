import { Slider, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SliderBoundary = () => {
  return (
    <View className="gap-4 bg-background p-4">
      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">默认值 120 会夹到 max=80</Text>
        <Slider
          defaultValue={120}
          max={80}
          min={20}
        />
      </View>
      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">step=0 按 1 处理</Text>
        <Slider
          defaultValue={35}
          step={0}
        />
      </View>
      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">区间未传初值时两端都停在 min=20</Text>
        <Slider
          range
          min={20}
        />
      </View>
    </View>
  );
};

export { SliderBoundary };
