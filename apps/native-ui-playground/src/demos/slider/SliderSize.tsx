import { Slider } from '@skyroc/native-ui';
import { View } from 'react-native';

const SliderSize = () => {
  return (
    <View className="gap-4 bg-background px-6 py-4">
      <Slider
        barSize={2}
        defaultValue={40}
        thumbSize={16}
      />
      <Slider
        barSize={6}
        defaultValue={40}
        thumbSize={24}
      />
      <Slider
        barSize={12}
        defaultValue={40}
        thumbSize={32}
      />
    </View>
  );
};

export { SliderSize };
