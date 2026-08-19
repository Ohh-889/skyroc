import { DatePickerView, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const DatePickerToolbar = () => {
  const [feedback, setFeedback] = useState('点击工具栏按钮查看回调结果');

  function handleCancel(values: string[]) {
    setFeedback(`onCancel：${values.join('-')}`);
  }

  function handleConfirm(values: string[]) {
    setFeedback(`onConfirm：${values.join('-')}`);
  }

  return (
    <View className="bg-background p-4">
      <Text className="mb-2 text-sm text-muted-foreground">{feedback}</Text>
      <DatePickerView
        cancelText="返回"
        confirmText="选定"
        defaultValue={['2026', '08', '19']}
        title="选择日期"
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </View>
  );
};

export { DatePickerToolbar };
