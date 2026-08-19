import { Slider, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SliderDisabled = () => {
  return (
    <View className="gap-4 bg-background p-4">
      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">disabled</Text>
        <Slider
          disabled
          defaultValue={40}
        />
      </View>
      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">readonly</Text>
        <Slider
          readonly
          defaultValue={40}
        />
      </View>
    </View>
  );
};

export { SliderDisabled };
