import type { PickerOption } from '@skyroc/native-ui';
import { PickerView, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const PRIORITIES: PickerOption[] = [
  { label: '低', value: 'low' },
  { label: '中', value: 'medium' },
  { label: '高', value: 'high' }
];

const PickerToolbar = () => {
  const [feedback, setFeedback] = useState('点击工具栏按钮查看回调结果');

  function handleCancel(values: string[]) {
    setFeedback(`onCancel：${values.join(', ')}`);
  }

  function handleConfirm(values: string[]) {
    setFeedback(`onConfirm：${values.join(', ')}`);
  }

  return (
    <View className="bg-background p-4">
      <Text className="mb-2 text-sm text-muted-foreground">{feedback}</Text>
      <PickerView
        cancelText="返回"
        columns={PRIORITIES}
        confirmText="选定"
        defaultValue={['medium']}
        title="选择优先级"
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </View>
  );
};

export { PickerToolbar };
