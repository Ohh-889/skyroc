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

/** 使用 id / name / sub 字段的级联数据 */
const REGIONS: PickerOption[] = [
  {
    id: 'zhejiang',
    name: '浙江',
    sub: [
      { id: 'hangzhou', name: '杭州' },
      { id: 'ningbo', name: '宁波' }
    ]
  },
  {
    id: 'jiangsu',
    name: '江苏',
    sub: [
      { id: 'nanjing', name: '南京' },
      { id: 'suzhou', name: '苏州' }
    ]
  }
];

/** 混合形态：第一个 tab 是级联，第二个 tab 是多列 */
const APPOINTMENT_PICKERS: PickerGroupItem[] = [
  {
    classNames: { itemText: 'text-primary' },
    columns: REGIONS,
    fieldNames: { children: 'sub', label: 'name', value: 'id' },
    haptic: true,
    key: 'region',
    title: '地区',
    visibleCount: 5
  },
  { columns: [HOURS, MINUTES], defaultValue: ['9', '30'], itemHeight: 52, key: 'time', title: '时间' }
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
