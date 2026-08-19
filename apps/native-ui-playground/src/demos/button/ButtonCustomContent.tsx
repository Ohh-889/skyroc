import { Button, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const ButtonCustomContent = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button variant="outline">{2026}</Button>
      <Button variant="tonal">
        <View className="flex-row items-center gap-2">
          <Text>★</Text>
          <Text>自定义节点</Text>
        </View>
      </Button>
    </View>
  );
};

export { ButtonCustomContent };
