import { Radio } from '@skyroc/native-ui';
import { View } from 'react-native';

const RadioShape = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Radio
        defaultChecked
        shape="round"
      >
        圆形（默认）
      </Radio>
      <Radio
        defaultChecked
        shape="square"
      >
        方形
      </Radio>
    </View>
  );
};

export { RadioShape };
