import type { PickerGroupItem, PickerOption } from '@skyroc/native-ui';
import { Cell, PickerGroup } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const HOURS: PickerOption[] = Array.from({ length: 24 }, (_, i) => ({
  label: `${i} 时`,
  value: `${i}`
}));

const MINUTES: PickerOption[] = Array.from({ length: 60 }, (_, i) => ({
  label: `${i} 分`,
  value: `${i}`
}));

/** 级联示例：省 → 市 */
const REGIONS: PickerOption[] = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      { label: '杭州', value: 'hangzhou' },
      { label: '宁波', value: 'ningbo' }
    ]
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [
      { label: '南京', value: 'nanjing' },
      { label: '苏州', value: 'suzhou' }
    ]
  }
];

/** 混合形态：第一个 tab 是级联，第二个 tab 是多列 */
const APPOINTMENT_PICKERS: PickerGroupItem[] = [
  { columns: REGIONS, key: 'region', title: '地区' },
  { columns: [HOURS, MINUTES], defaultValue: ['9', '30'], key: 'time', title: '时间' }
];

const PickerGroupMixed = () => {
  const [appointmentShow, setAppointmentShow] = useState(false);
  const [appointmentValues, setAppointmentValues] = useState<string[][]>([]);

  const appointmentLabel =
    appointmentValues.length > 0 ? appointmentValues.map(values => values.join(' ')).join('，') : '请选择';

  return (
    <View className="bg-background px-6">
      <View className="mb-8">
        <PickerGroup
          nextStepText="选时间"
          pickers={APPOINTMENT_PICKERS}
          show={appointmentShow}
          values={appointmentValues}
          onConfirm={setAppointmentValues}
          onUpdateShow={setAppointmentShow}
        >
          {args => (
            <Cell
              showArrow
              title="预约"
              trailing={appointmentLabel}
              onPress={args.open}
            />
          )}
        </PickerGroup>
      </View>
    </View>
  );
};

export { PickerGroupMixed };
