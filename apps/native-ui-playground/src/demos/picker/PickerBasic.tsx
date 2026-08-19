import type { PickerOption } from '@skyroc/native-ui';
import { PickerView } from '@skyroc/native-ui';
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

const PickerBasic = () => {
  return (
    <View className="bg-background px-6">
      <View className="mb-8">
        <PickerView
          haptic
          columns={FRUITS}
          defaultValue={['orange']}
          showToolbar={false}
        />
      </View>
    </View>
  );
};

export { PickerBasic };
