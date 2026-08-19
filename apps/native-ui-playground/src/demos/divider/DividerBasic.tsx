import { Divider, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const DividerBasic = () => {
  return (
    <View className="bg-background p-4">
      <Text className="text-sm text-foreground">上方内容</Text>
      <Divider />
      <Text className="text-sm text-foreground">下方内容</Text>
    </View>
  );
};

export { DividerBasic };
