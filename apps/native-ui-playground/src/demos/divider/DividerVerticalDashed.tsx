import { Divider, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const DividerVerticalDashed = () => {
  return (
    <View className="flex-row items-center bg-background p-4">
      <Text className="text-sm">A</Text>
      <Divider
        border="dashed"
        orientation="vertical"
      />
      <Text className="text-sm">B</Text>
      <Divider
        border="dashed"
        orientation="vertical"
      />
      <Text className="text-sm">C</Text>
    </View>
  );
};

export { DividerVerticalDashed };
