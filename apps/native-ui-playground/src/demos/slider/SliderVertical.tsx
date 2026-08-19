import { Slider } from '@skyroc/native-ui';
import { View } from 'react-native';

const SliderVertical = () => {
  return (
    <View className="bg-background px-6 py-4">
      <View className="h-56 flex-row gap-8">
        <Slider
          vertical
          defaultValue={40}
        />
        <Slider
          range
          vertical
          color="success"
          defaultValue={[20, 80]}
        />
        <Slider
          vertical
          barSize={8}
          color="warning"
          defaultValue={65}
          thumbSize={28}
        />
      </View>
    </View>
  );
};

export { SliderVertical };
