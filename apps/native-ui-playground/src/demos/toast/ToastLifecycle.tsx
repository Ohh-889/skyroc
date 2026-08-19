import { Button, Text, allowMultipleToast, showLoadingToast, showToast } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const ToastLifecycle = () => {
  const [closeCount, setCloseCount] = useState(0);

  function handleCountedToast() {
    showToast({
      message: '关闭时计数 +1',
      onClose: () => setCloseCount(prev => prev + 1)
    });
  }

  function handleLoadingThenSuccess() {
    const instance = showLoadingToast('上传中...');

    setTimeout(() => {
      // loading 常驻是从 type 推导的，改成 success 后自动恢复 2 秒关闭，无需再传 duration
      instance.update({ message: '上传成功', type: 'success' });
    }, 1500);
  }

  function handleMultiple() {
    allowMultipleToast(true);

    showToast({ message: '第一条', position: 'top' });
    showToast({ message: '第二条', position: 'top' });
    showToast({ message: '第三条', position: 'top' });

    allowMultipleToast(false);
  }

  return (
    <View className="bg-background px-6 py-4">
      <View className="mb-2 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={handleLoadingThenSuccess}
        >
          loading → success
        </Button>
        <Button
          variant="tonal"
          onPress={handleCountedToast}
        >
          onClose 计数
        </Button>
        <Button
          variant="tonal"
          onPress={handleMultiple}
        >
          同时显示多条
        </Button>
      </View>
      <Text color="muted">onClose 已触发 {closeCount} 次（每关闭一次只应 +1）</Text>
    </View>
  );
};

export { ToastLifecycle };
