import { Button, showNotify } from '@skyroc/native-ui';
import { View } from 'react-native';

const NotifyInteraction = () => {
  function handleManualClose() {
    const instance = showNotify({ duration: 0, message: '常驻，2 秒后由代码关闭' });

    setTimeout(() => instance.close(), 2000);
  }

  function handleUpdate() {
    const instance = showNotify({ duration: 0, message: '上传中...', type: 'primary' });

    // 原地更新，不重放动画；重新按新的 duration 计时
    setTimeout(() => instance.update({ duration: 2000, message: '上传成功', type: 'success' }), 1500);
  }

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background px-6 py-4">
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
      <Button
        variant="tonal"
        onPress={handleManualClose}
      >
        常驻 + 命令式关闭
      </Button>
      <Button
        variant="tonal"
        onPress={handleUpdate}
      >
        原地 update
      </Button>
    </View>
  );
};

export { NotifyInteraction };
