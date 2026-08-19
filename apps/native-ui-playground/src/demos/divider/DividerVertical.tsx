import { Divider, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const DividerVertical = () => {
  return (
    <View className="flex-row items-center bg-background p-4">
      <Text className="text-sm">Left</Text>
      <Divider orientation="vertical" />
      <Text className="text-sm">Center</Text>
      <Divider orientation="vertical" />
      <Text className="text-sm">Right</Text>
    </View>
  );
};

export { DividerVertical };
