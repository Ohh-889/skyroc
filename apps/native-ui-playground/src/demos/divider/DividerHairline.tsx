import { Divider, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const DividerHairline = () => {
  return (
    <View className="bg-background p-4">
      <Text className="mb-1 text-xs text-muted-foreground">hairline (default)</Text>
      <Divider />
      <Text className="mb-1 text-xs text-muted-foreground">1px (hairline=false)</Text>
      <Divider hairline={false} />
    </View>
  );
};

export { DividerHairline };
