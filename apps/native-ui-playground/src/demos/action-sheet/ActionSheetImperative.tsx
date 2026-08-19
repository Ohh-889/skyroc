import type { ActionSheetAction } from '@skyroc/native-ui';
import { Button, Text, closeActionSheet, showActionSheet } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const BASIC_ACTIONS: ActionSheetAction[] = [
  { name: '选项一', value: 'one' },
  { name: '选项二', value: 'two' },
  { name: '选项三', value: 'three' }
];

const ActionSheetImperative = () => {
  const [lastResult, setLastResult] = useState('尚未调用');

  async function handleImperative() {
    const result = await showActionSheet({
      actions: BASIC_ACTIONS,
      cancelText: '取消',
      description: '选中返回 action 与 index，取消返回 null',
      title: '命令式调用'
    });

    setLastResult(result ? `选中 ${result.action.value}（索引 ${result.index}）` : '已取消');
  }

  function handleAutoClose() {
    showActionSheet({
      actions: BASIC_ACTIONS,
      description: '面板将在两秒后由 closeActionSheet 关闭',
      title: '外部关闭'
    });

    setTimeout(closeActionSheet, 2000);
  }

  return (
    <View className="gap-3 bg-background p-4">
      <Text className="text-sm text-muted-foreground">上次结果：{lastResult}</Text>
      <View className="flex-row flex-wrap gap-3">
        <Button
          className="min-w-32 flex-1"
          variant="tonal"
          onPress={handleImperative}
        >
          等待选择结果
        </Button>
        <Button
          className="min-w-32 flex-1"
          variant="outline"
          onPress={handleAutoClose}
        >
          两秒后关闭
        </Button>
      </View>
    </View>
  );
};

export { ActionSheetImperative };
