import { Divider, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const DividerHairline = () => {
  return (
    <View className="bg-background p-4">
      <Text className="text-xs text-muted-foreground">hairline=true（默认，1 物理像素）</Text>
      <Divider />
      <Text className="text-xs text-muted-foreground">hairline=false（1dp）</Text>
      <Divider hairline={false} />
    </View>
  );
};

export { DividerHairline };
