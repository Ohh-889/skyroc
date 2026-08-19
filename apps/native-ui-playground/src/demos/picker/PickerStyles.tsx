import type { PickerOption } from '@skyroc/native-ui';
import { PickerView } from '@skyroc/native-ui';
import { View } from 'react-native';

const LEVELS: PickerOption[] = [
  { label: '入门', value: 'starter' },
  { label: '进阶', value: 'advanced' },
  { label: '专家', value: 'expert' }
];

const PickerStyles = () => {
  return (
    <View className="bg-muted p-4">
      <PickerView
        className="border border-primary/20"
        classNames={{
          itemText: 'text-primary',
          selectedIndicator: 'border-primary/40 bg-primary/5',
          title: 'text-primary'
        }}
        columns={LEVELS}
        defaultValue={['advanced']}
        title="选择级别"
      />
    </View>
  );
};

export { PickerStyles };
