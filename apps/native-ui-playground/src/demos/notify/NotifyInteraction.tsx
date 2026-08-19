import { Button, showNotify } from '@skyroc/native-ui';
import { View } from 'react-native';

const NotifyInteraction = () => {
  return (
    <View className="bg-background p-4">
      <Button
        variant="tonal"
        onPress={() =>
          showNotify({
            duration: 0,
            message: '点我触发 onClick',
            onClick: () => showNotify({ message: '收到点击', type: 'success' })
          })
        }
      >
        可点击
      </Button>
    </View>
  );
};

export { NotifyInteraction };
