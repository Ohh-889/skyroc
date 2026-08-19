import { Button, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const ButtonShape = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button shape="rounded">rounded</Button>
      <Button shape="pill">pill</Button>
      <Button
        shape="circle"
        size="icon"
      >
        <Text className="text-xl">+</Text>
      </Button>
    </View>
  );
};

export { ButtonShape };
