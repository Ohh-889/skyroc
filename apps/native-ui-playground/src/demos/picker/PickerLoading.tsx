import type { PickerOption } from '@skyroc/native-ui';
import { Button, PickerView } from '@skyroc/native-ui';
import { useEffect, useState } from 'react';
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

/** 异步加载的模拟耗时（ms） */
const MOCK_LOADING_DELAY = 1500;

const PickerLoading = () => {
  const [loading, setLoading] = useState(true);

  function reload() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, MOCK_LOADING_DELAY);
  }

  useEffect(() => {
    reload();
  }, []);

  return (
    <View className="bg-background p-4">
      <View className="mb-4">
        <Button
          variant="tonal"
          onPress={reload}
        >
          重新加载
        </Button>
      </View>
      <PickerView
        columns={loading ? [] : FRUITS}
        defaultValue={['apple']}
        loading={loading}
        showToolbar={false}
      />
    </View>
  );
};

export { PickerLoading };
