import { Button } from '@skyroc/native-ui';
import { View } from 'react-native';

const ButtonVariant = () => {
  return (
    <View className="gap-3 bg-background p-6">
      <Button variant="solid">Solid</Button>
      <Button variant="tonal">Tonal</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </View>
  );
};

export { ButtonVariant };
