import { Button } from '@skyroc/native-ui';
import Feather from '@expo/vector-icons/Feather';
import { View } from 'react-native';

const ButtonSize = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-6">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Feather
          color="#ffffff"
          name="plus"
          size={18}
        />
      </Button>
    </View>
  );
};

export { ButtonSize };
