import { Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const TextStyles = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Text
        className="text-warning"
        color="primary"
      >
        color 设置为 primary，className 覆盖为 warning
      </Text>
      <Text className="text-xl font-bold tracking-wide text-info">通过 className 自定义字号、字重与字距</Text>
    </View>
  );
};

export { TextStyles };
