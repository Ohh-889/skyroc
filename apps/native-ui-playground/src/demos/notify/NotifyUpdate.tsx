import { Button, showNotify } from '@skyroc/native-ui';
import { View } from 'react-native';

const NotifyUpdate = () => {
  function handleUpdate() {
    const instance = showNotify({ duration: 0, message: '处理中...', type: 'primary' });

    setTimeout(() => instance.update({ duration: 2000, message: '处理成功', type: 'success' }), 1500);
  }

  return (
    <View className="bg-background p-4">
      <Button
        variant="tonal"
        onPress={handleUpdate}
      >
        原地更新通知
      </Button>
    </View>
  );
};

export { NotifyUpdate };
