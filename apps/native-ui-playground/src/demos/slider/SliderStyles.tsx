import { Slider } from '@skyroc/native-ui';
import { View } from 'react-native';

const SliderStyles = () => {
  return (
    <View className="gap-4 bg-background px-6 py-4">
      <Slider
        className="rounded-xl bg-secondary px-4"
        defaultValue={45}
      />
      <Slider
        classNames={{
          activeBar: 'bg-info',
          thumbInner: 'border-info bg-info/10',
          track: 'bg-info/20'
        }}
        defaultValue={60}
      />
    </View>
  );
};

export { SliderStyles };
