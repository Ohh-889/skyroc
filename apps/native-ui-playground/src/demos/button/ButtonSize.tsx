import { Button, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const ButtonSize = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button size="sm">sm</Button>
      <Button size="md">md</Button>
      <Button size="lg">lg</Button>
      <Button size="icon">
        <Text className="text-xl">+</Text>
      </Button>
    </View>
  );
};

export { ButtonSize };
