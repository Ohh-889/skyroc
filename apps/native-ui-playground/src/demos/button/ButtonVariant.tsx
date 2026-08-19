import { Button } from '@skyroc/native-ui';
import { View } from 'react-native';

const ButtonVariant = () => {
  return (
    <View className="flex-row flex-wrap gap-3 bg-background p-4">
      <Button
        className="min-w-32 flex-1"
        variant="solid"
      >
        solid
      </Button>
      <Button
        className="min-w-32 flex-1"
        variant="tonal"
      >
        tonal
      </Button>
      <Button
        className="min-w-32 flex-1"
        variant="outline"
      >
        outline
      </Button>
      <Button
        className="min-w-32 flex-1"
        variant="ghost"
      >
        ghost
      </Button>
    </View>
  );
};

export { ButtonVariant };
