import type { PickerOption } from '@skyroc/native-ui';
import { PickerView } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 带禁用项的单列示例 */
const SEATS: PickerOption[] = [
  { label: 'A 排（已满）', value: 'a', disabled: true },
  { label: 'B 排', value: 'b' },
  { label: 'C 排（已满）', value: 'c', disabled: true },
  { label: 'D 排（已满）', value: 'd', disabled: true },
  { label: 'E 排', value: 'e' },
  { label: 'F 排', value: 'f' }
];

const PickerDisabled = () => {
  return (
    <View className="bg-background px-6">
      <View className="mb-8">
        <PickerView
          columns={SEATS}
          showToolbar={false}
        />
      </View>
    </View>
  );
};

export { PickerDisabled };
