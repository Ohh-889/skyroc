import type { ActionSheetAction } from '@skyroc/native-ui';
import { ActionSheet, Button, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const BASIC_ACTIONS: ActionSheetAction[] = [
  { name: '选项一', value: 'one' },
  { name: '选项二', value: 'two' },
  { name: '选项三', value: 'three' }
];

const ActionSheetBasic = () => {
  const [show, setShow] = useState(false);
  const [result, setResult] = useState('尚未操作');
  const [closedCount, setClosedCount] = useState(0);

  function handleSelect(action: ActionSheetAction, index: number) {
    setResult(`选中 ${action.name}（索引 ${index}）`);
  }

  return (
    <View className="bg-background">
      <View className="gap-3 p-4">
        <Button
          variant="tonal"
          onPress={() => setShow(true)}
        >
          打开基础面板
        </Button>
        <Text className="text-sm text-muted-foreground">结果：{result}</Text>
        <Text className="text-sm text-muted-foreground">已完成关闭动画：{closedCount} 次</Text>
      </View>

      <ActionSheet
        closeOnClickAction
        actions={BASIC_ACTIONS}
        cancelText="取消"
        defaultValue="two"
        description="默认选中“选项二”"
        show={show}
        title="请选择"
        onCancel={() => setResult('已取消')}
        onClosed={() => setClosedCount(count => count + 1)}
        onSelect={handleSelect}
        onUpdateShow={setShow}
      />
    </View>
  );
};

export { ActionSheetBasic };
