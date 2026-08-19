import type { PickerGroupItem, PickerOption } from '@skyroc/native-ui';
import { PickerGroupView, Text } from '@skyroc/native-ui';
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

const PickerGroupBasic = () => {
  const [liveValues, setLiveValues] = useState<string[][]>([]);
  const [lastEvent, setLastEvent] = useState('尚未触发');

  const liveLabel = liveValues.length > 0 ? JSON.stringify(liveValues) : '尚未滚动';

  function handleCancel() {
    setLastEvent('onCancel');
  }

  function handleChange(values: string[][], pickerIndex: number) {
    setLiveValues(values);
    setLastEvent(`onChange：第 ${pickerIndex + 1} 个选择器`);
  }

  function handleConfirm() {
    setLastEvent('onConfirm');
  }

  function handleTabChange(index: number) {
    setLastEvent(`onTabChange：第 ${index + 1} 个 tab`);
  }

  return (
    <View className="bg-background px-6">
      <View className="mb-8">
        <PickerGroupView
          pickers={TRIP_PICKERS}
          onCancel={handleCancel}
          onChange={handleChange}
          onConfirm={handleConfirm}
          onTabChange={handleTabChange}
        />
        <Text
          className="mt-2"
          color="muted"
        >
          onChange 实时回传：{liveLabel}
        </Text>
        <Text
          className="mt-1"
          color="muted"
        >
          最近事件：{lastEvent}
        </Text>
      </View>
    </View>
  );
};

export { PickerGroupBasic };
