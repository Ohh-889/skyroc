import type { PickerOption } from '@skyroc/native-ui';
import { PickerView } from '@skyroc/native-ui';
import { View } from 'react-native';

const YEARS: PickerOption[] = Array.from({ length: 10 }, (_, i) => ({
  label: `${2020 + i} 年`,
  value: `${2020 + i}`
}));

const MONTHS: PickerOption[] = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1} 月`,
  value: `${i + 1}`
}));

const DAYS: PickerOption[] = Array.from({ length: 31 }, (_, i) => ({
  label: `${i + 1} 日`,
  value: `${i + 1}`
}));

const PickerMultiColumn = () => {
  return (
    <View className="bg-background px-6">
      <View className="mb-8">
        <PickerView
          columns={[YEARS, MONTHS, DAYS]}
          defaultValue={['2026', '2', '21']}
          title="选择日期"
        />
      </View>
    </View>
  );
};

export { PickerMultiColumn };
