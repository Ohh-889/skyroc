import { Slider } from '@skyroc/native-ui';
import { View } from 'react-native';

const SliderDisabled = () => {
  return (
    <View className="gap-4 bg-background px-6 py-4">
      <Slider
        disabled
        defaultValue={40}
      />
      <Slider
        readonly
        defaultValue={40}
      />
    </View>
  );
};

export { SliderDisabled };
