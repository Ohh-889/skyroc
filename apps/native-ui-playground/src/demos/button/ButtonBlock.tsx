import { Button } from '@skyroc/native-ui';
import { View } from 'react-native';

const ButtonBlock = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Button block>通栏按钮</Button>
      <Button
        block
        variant="outline"
      >
        通栏描边按钮
      </Button>
    </View>
  );
};

export { ButtonBlock };
