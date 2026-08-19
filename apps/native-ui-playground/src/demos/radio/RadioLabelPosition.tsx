import { Radio } from '@skyroc/native-ui';
import { View } from 'react-native';

const RadioLabelPosition = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Radio labelPosition="right">标签在右侧</Radio>
      <Radio labelPosition="left">标签在左侧</Radio>
      <Radio labelDisabled>标签不可点击，仅指示器可选</Radio>
    </View>
  );
};

export { RadioLabelPosition };
