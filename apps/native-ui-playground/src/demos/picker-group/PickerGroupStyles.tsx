import type { PickerGroupItem, PickerOption } from '@skyroc/native-ui';
import { PickerGroupView } from '@skyroc/native-ui';
import { View } from 'react-native';

const LEVELS: PickerOption[] = [
  { label: '初级', value: 'junior' },
  { label: '中级', value: 'middle' },
  { label: '高级', value: 'senior' }
];

const STYLE_PICKERS: PickerGroupItem[] = [
  { columns: LEVELS, key: 'current', title: '当前等级' },
  { columns: LEVELS, key: 'target', title: '目标等级' }
];

const PickerGroupStyles = () => {
  return (
    <View className="bg-background px-4 pb-4">
      <PickerGroupView
        className="overflow-hidden rounded-xl border border-primary/30"
        classNames={{
          activeIndicator: 'h-1 rounded-full',
          confirmText: 'font-semibold text-success',
          tabBar: 'bg-primary/5',
          tabText: 'text-base'
        }}
        pickers={STYLE_PICKERS}
      />
    </View>
  );
};

export { PickerGroupStyles };
