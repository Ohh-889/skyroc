import type { PickerOption } from '@skyroc/native-ui';
import { Button, Picker, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const FRUITS: PickerOption[] = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橘子', value: 'orange' },
  { label: '葡萄', value: 'grape' },
  { label: '西瓜', value: 'watermelon' },
  { label: '桃子', value: 'peach' },
  { label: '梨', value: 'pear' }
];

const PickerPopup = () => {
  const [fruitShow, setFruitShow] = useState(false);
  const [fruitValue, setFruitValue] = useState<string[]>(['orange']);
  const [feedback, setFeedback] = useState('尚未操作');

  function handleCancel(values: string[]) {
    setFeedback(`已取消临时值 ${values.join(', ')}`);
  }

  function handleConfirm(values: string[]) {
    setFruitValue(values);
    setFeedback(`已确认 ${values.join(', ')}`);
  }

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => setFruitShow(true)}
      >
        打开选择器
      </Button>
      <Text color="muted">当前：{fruitValue.join(', ') || '未选择'}</Text>
      <Text className="w-full text-sm text-muted-foreground">{feedback}</Text>

      <Picker
        enablePanDownToClose
        showHandle
        columns={FRUITS}
        sheetClassName="border border-primary/15"
        sheetClassNames={{ handleBar: 'bg-primary/40' }}
        show={fruitShow}
        title="选择水果"
        value={fruitValue}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        onUpdateShow={setFruitShow}
      />
    </View>
  );
};

export { PickerPopup };
