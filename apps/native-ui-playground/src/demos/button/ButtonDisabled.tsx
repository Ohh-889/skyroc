import { Button } from '@skyroc/native-ui';
import { View } from 'react-native';

const ButtonDisabled = () => {
  return (
    <View className="gap-3 bg-background p-6">
      <Button disabled>Solid</Button>
      <Button
        disabled
        variant="tonal"
      >
        Tonal
      </Button>
      <Button
        disabled
        variant="outline"
      >
        Outline
      </Button>
      <Button
        disabled
        variant="ghost"
      >
        Ghost
      </Button>
    </View>
  );
};

export { ButtonDisabled };
