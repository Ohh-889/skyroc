import { Button } from '@skyroc/native-ui';
import { View } from 'react-native';

const ButtonDisabled = () => {
  return (
    <View className="flex-row flex-wrap gap-3 bg-background p-4">
      <Button
        className="min-w-32 flex-1"
        disabled
      >
        solid
      </Button>
      <Button
        className="min-w-32 flex-1"
        disabled
        variant="tonal"
      >
        tonal
      </Button>
      <Button
        className="min-w-32 flex-1"
        disabled
        variant="outline"
      >
        outline
      </Button>
      <Button
        className="min-w-32 flex-1"
        disabled
        variant="ghost"
      >
        ghost
      </Button>
    </View>
  );
};

export { ButtonDisabled };
