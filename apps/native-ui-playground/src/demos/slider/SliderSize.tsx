import { Slider, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SliderSize = () => {
  return (
    <View className="gap-4 bg-background p-4">
      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">barSize=2 / thumbSize=16</Text>
        <Slider
          barSize={2}
          defaultValue={40}
          thumbSize={16}
        />
      </View>
      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">barSize=6 / thumbSize=24</Text>
        <Slider
          barSize={6}
          defaultValue={40}
          thumbSize={24}
        />
      </View>
      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">barSize=12 / thumbSize=32</Text>
        <Slider
          barSize={12}
          defaultValue={40}
          thumbSize={32}
        />
      </View>
    </View>
  );
};

export { SliderSize };
