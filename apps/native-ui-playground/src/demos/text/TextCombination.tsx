import { Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const TextCombination = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Text
        color="primary"
        size="2xl"
        weight="bold"
      >
        2xl + bold + primary
      </Text>
      <Text
        color="success"
        size="sm"
        weight="medium"
      >
        sm + medium + success
      </Text>
    </View>
  );
};

export { TextCombination };
