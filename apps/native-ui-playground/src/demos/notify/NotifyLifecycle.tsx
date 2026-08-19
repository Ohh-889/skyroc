import { Button, Text, showNotify } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const NotifyLifecycle = () => {
  const [closeCount, setCloseCount] = useState(0);

  function handleCountedNotify() {
    showNotify({
      message: '关闭时计数 +1',
      onClose: () => setCloseCount(prev => prev + 1)
    });
  }

  function handleReplaced() {
    // 第一条会被第二条顶替，被顶替同样算关闭，它的 onClose 也应各记一次
    showNotify({ message: '第一条（即将被顶替）', onClose: () => setCloseCount(prev => prev + 1) });
    showNotify({ message: '第二条（顶替了第一条）', onClose: () => setCloseCount(prev => prev + 1) });
  }

  return (
    <View className="bg-background p-4">
      <View className="mb-2 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={handleCountedNotify}
        >
          onClose 计数
        </Button>
        <Button
          variant="tonal"
          onPress={handleReplaced}
        >
          顶替（应 +1）
        </Button>
      </View>
      <Text color="muted">onClose 已触发 {closeCount} 次（每关闭一条只应 +1）</Text>
    </View>
  );
};

export { NotifyLifecycle };
