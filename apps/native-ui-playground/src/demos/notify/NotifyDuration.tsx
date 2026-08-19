import { Button, showNotify } from '@skyroc/native-ui';
import { View } from 'react-native';

const NotifyDuration = () => {
  function handleManualClose() {
    const instance = showNotify({ duration: 0, message: '常驻通知，2 秒后由实例关闭' });

    setTimeout(() => instance.close(), 2000);
  }

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => showNotify({ duration: 1000, message: '1 秒后自动关闭' })}
      >
        自定义时长
      </Button>
      <Button
        variant="tonal"
        onPress={handleManualClose}
      >
        常驻 + 实例关闭
      </Button>
    </View>
  );
};

export { NotifyDuration };
