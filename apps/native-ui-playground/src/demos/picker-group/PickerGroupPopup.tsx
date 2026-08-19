import type { PickerGroupItem, PickerOption } from '@skyroc/native-ui';
import { Button, PickerGroup, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const MONTHS: PickerOption[] = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1} 月`,
  value: `${i + 1}`
}));

const DAYS: PickerOption[] = Array.from({ length: 31 }, (_, i) => ({
  label: `${i + 1} 日`,
  value: `${i + 1}`
}));

/** 两段行程：每个 tab 各是一个独立的多列选择器 */
const TRIP_PICKERS: PickerGroupItem[] = [
  { columns: [MONTHS, DAYS], defaultValue: ['3', '1'], key: 'depart', title: '去程' },
  { columns: [MONTHS, DAYS], defaultValue: ['3', '8'], key: 'return', title: '返程' }
];

const PickerGroupPopup = () => {
  const [tripShow, setTripShow] = useState(false);
  const [tripValues, setTripValues] = useState<string[][]>([
    ['3', '1'],
    ['3', '8']
  ]);

  const tripLabel = tripValues.map(values => values.join('/')).join('  →  ');

  return (
    <View className="bg-background px-6">
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setTripShow(true)}
        >
          选择行程
        </Button>
        <Text color="muted">当前：{tripLabel}</Text>

        <PickerGroup
          pickers={TRIP_PICKERS}
          show={tripShow}
          values={tripValues}
          onConfirm={setTripValues}
          onUpdateShow={setTripShow}
        />
      </View>
    </View>
  );
};

export { PickerGroupPopup };
