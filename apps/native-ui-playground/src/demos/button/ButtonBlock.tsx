import { Button } from '@skyroc/native-ui';
import { View } from 'react-native';

const ButtonBlock = () => {
  return (
    <View className="gap-3 bg-background p-6">
      <Button block>Block Button</Button>
      <Button
        block
        variant="outline"
      >
        Block Outline
      </Button>
    </View>
  );
};

export { ButtonBlock };
