import { Divider, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const DividerCustomContent = () => {
  return (
    <View className="bg-background p-4">
      <Divider>
        <View className="rounded-full bg-primary/10 px-3 py-1">
          <Text className="text-xs font-medium text-primary">自定义节点</Text>
        </View>
      </Divider>
    </View>
  );
};

export { DividerCustomContent };
