import { Button, Text, showConfirmDialog } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const DialogBeforeClose = () => {
  const [result, setResult] = useState('尚未操作');

  function handleSyncGuard() {
    showConfirmDialog({
      beforeClose: action => action === 'confirm',
      callback: action => setResult(`同步拦截最终结果：${action}`),
      message: '点击取消会被阻止，点击确认才会关闭。',
      title: '同步拦截'
    });
  }

  function handleAsyncGuard() {
    showConfirmDialog({
      beforeClose: action => {
        if (action === 'cancel') return true;

        return new Promise<boolean>(resolve => {
          setTimeout(() => resolve(true), 1500);
        });
      },
      callback: action => setResult(`异步拦截最终结果：${action}`),
      message: '点击确认后等待 1.5 秒，期间按钮显示 loading。',
      title: '异步拦截'
    });
  }

  return (
    <View className="gap-3 bg-background p-4">
      <View className="flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={handleSyncGuard}
        >
          同步阻止取消
        </Button>
        <Button
          variant="tonal"
          onPress={handleAsyncGuard}
        >
          异步确认
        </Button>
      </View>
      <Text className="text-sm text-muted-foreground">{result}</Text>
    </View>
  );
};

export { DialogBeforeClose };
