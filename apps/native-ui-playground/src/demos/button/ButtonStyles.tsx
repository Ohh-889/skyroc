import { Button } from '@skyroc/native-ui';
import { View } from 'react-native';

const ButtonStyles = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Button
        className="border-2 border-dashed"
        variant="outline"
      >
        className 容器样式
      </Button>
      <Button
        classNames={{ root: 'bg-info/15', text: 'font-bold text-info' }}
        variant="tonal"
      >
        classNames slot 样式
      </Button>
    </View>
  );
};

export { ButtonStyles };
