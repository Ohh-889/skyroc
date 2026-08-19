import type { PickerOption } from '@skyroc/native-ui';
import { Button, PickerView, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const COLORS: PickerOption[] = [
  { label: '红色', value: 'red' },
  { label: '绿色', value: 'green' },
  { label: '蓝色', value: 'blue' },
  { label: '紫色', value: 'purple' }
];

const PickerControlled = () => {
  const [value, setValue] = useState<string[]>(['green']);

  return (
    <View className="bg-background p-4">
      <View className="mb-3 flex-row flex-wrap items-center gap-3">
        <Button
          size="sm"
          variant="tonal"
          onPress={() => setValue(['blue'])}
        >
          外部选中蓝色
        </Button>
        <Text className="text-sm text-muted-foreground">当前 value：{value.join(', ')}</Text>
      </View>
      <PickerView
        columns={COLORS}
        showToolbar={false}
        value={value}
        onChange={setValue}
      />
    </View>
  );
};

export { PickerControlled };
