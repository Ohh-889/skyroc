import { Divider, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const DividerDashed = () => {
  return (
    <View className="bg-background p-4">
      <Text className="text-xs text-muted-foreground">solid</Text>
      <Divider border="solid" />
      <Text className="text-xs text-muted-foreground">dashed</Text>
      <Divider border="dashed" />
      <Text className="text-xs text-muted-foreground">dotted</Text>
      <Divider border="dotted" />
    </View>
  );
};

export { DividerDashed };
