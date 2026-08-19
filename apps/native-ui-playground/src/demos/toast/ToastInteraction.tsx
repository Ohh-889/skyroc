import { Button, showToast } from '@skyroc/native-ui';
import { View } from 'react-native';

const ToastInteraction = () => {
  function handleManualClose() {
    const instance = showToast({ duration: 0, message: '常驻，2 秒后由代码关闭' });

    setTimeout(() => instance.close(), 2000);
  }

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background px-6 py-4">
      <Button
        variant="tonal"
        onPress={() => showToast({ closeOnClick: true, duration: 0, message: '点我关闭' })}
      >
        点击关闭
      </Button>
      <Button
        variant="tonal"
        onPress={() => showToast({ forbidClick: true, message: '背景已被遮罩拦截', position: 'top' })}
      >
        禁止背景点击
      </Button>
      <Button
        variant="tonal"
        onPress={handleManualClose}
      >
        常驻 + 命令式关闭
      </Button>
    </View>
  );
};

export { ToastInteraction };
