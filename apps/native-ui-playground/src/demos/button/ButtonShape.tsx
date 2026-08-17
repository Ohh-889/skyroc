import { Button } from '@skyroc/native-ui';
import Feather from '@expo/vector-icons/Feather';
import { View } from 'react-native';

const ButtonShape = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-6">
      <Button shape="rounded">Rounded</Button>
      <Button shape="pill">Pill</Button>
      <Button
        shape="circle"
        size="icon"
      >
        <Feather
          color="#ffffff"
          name="plus"
          size={18}
        />
      </Button>
    </View>
  );
};

export { ButtonShape };
