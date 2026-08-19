import { Divider, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const DividerBasic = () => {
  return (
    <View className="bg-background p-4">
      <Text className="text-sm">Some content above</Text>
      <Divider />
      <Text className="text-sm">Some content below</Text>
    </View>
  );
};

export { DividerBasic };
