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

  return (
    <View className="bg-background px-6">
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setFruitShow(true)}
        >
          打开选择器
        </Button>
        <Text color="muted">当前：{fruitValue.join(', ') || '未选择'}</Text>

        <Picker
          columns={FRUITS}
          show={fruitShow}
          title="选择水果"
          value={fruitValue}
          onConfirm={setFruitValue}
          onUpdateShow={setFruitShow}
        />
      </View>
    </View>
  );
};

export { PickerPopup };
