import { Button, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const TextContext = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Button color="destructive">
        <Text>未传文字变体，继承按钮样式</Text>
      </Button>
      <Button
        color="primary"
        variant="tonal"
      >
        <Text
          color="warning"
          weight="bold"
        >
          显式 color / weight 覆盖继承值
        </Text>
      </Button>
    </View>
  );
};

export { TextContext };
