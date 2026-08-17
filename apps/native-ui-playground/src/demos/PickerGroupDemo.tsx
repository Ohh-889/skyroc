import type { PickerGroupItem, PickerOption } from '@skyroc/native-ui';
import { Button, Cell, PickerGroup, PickerGroupView, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

const MONTHS: PickerOption[] = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1} 月`,
  value: `${i + 1}`
}));

const DAYS: PickerOption[] = Array.from({ length: 31 }, (_, i) => ({
  label: `${i + 1} 日`,
  value: `${i + 1}`
}));

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

/** 两段行程：每个 tab 各是一个独立的多列选择器 */
const TRIP_PICKERS: PickerGroupItem[] = [
  { columns: [MONTHS, DAYS], defaultValue: ['3', '1'], key: 'depart', title: '去程' },
  { columns: [MONTHS, DAYS], defaultValue: ['3', '8'], key: 'return', title: '返程' }
];

/** 混合形态：第一个 tab 是级联，第二个 tab 是多列 */
const APPOINTMENT_PICKERS: PickerGroupItem[] = [
  { columns: REGIONS, key: 'region', title: '地区' },
  { columns: [HOURS, MINUTES], defaultValue: ['9', '30'], key: 'time', title: '时间' }
];

/** 只有一个 picker 时 tab 栏会自动隐藏 */
const SINGLE_PICKERS: PickerGroupItem[] = [{ columns: [HOURS, MINUTES], key: 'time', title: '时间' }];

const PickerGroupDemo = () => {
  const [tripShow, setTripShow] = useState(false);
  const [tripValues, setTripValues] = useState<string[][]>([
    ['3', '1'],
    ['3', '8']
  ]);
  const [appointmentShow, setAppointmentShow] = useState(false);
  const [appointmentValues, setAppointmentValues] = useState<string[][]>([]);
  const [singleShow, setSingleShow] = useState(false);
  const [liveValues, setLiveValues] = useState<string[][]>([]);

  const tripLabel = tripValues.map(values => values.join('/')).join('  →  ');
  const appointmentLabel =
    appointmentValues.length > 0 ? appointmentValues.map(values => values.join(' ')).join('，') : '请选择';
  const liveLabel = liveValues.length > 0 ? JSON.stringify(liveValues) : '尚未滚动';

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-2 text-lg font-semibold">基础用法</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        多个选择器共用一套工具栏；不在最后一个 tab 时主按钮是「下一步」，走到最后才变成「确定」
      </Text>
      <View className="mb-8">
        <PickerGroupView
          pickers={TRIP_PICKERS}
          onChange={setLiveValues}
        />
        <Text
          className="mt-2"
          color="muted"
        >
          onChange 实时回传：{liveLabel}
        </Text>
      </View>

      {/* 弹层用法 */}
      <Text className="mb-2 text-lg font-semibold">弹层用法</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        滚动与切 tab 都是临时的，点「确定」才写回 values；再次打开会重置回已确认值并回到第一个 tab
      </Text>
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

      {/* 混合形态与自定义触发元素 */}
      <Text className="mb-2 text-lg font-semibold">混合形态与触发元素</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        每个 tab 的列形态互不相干，这里第一个是级联、第二个是多列；children 传函数就能自己画触发元素
      </Text>
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

      {/* 单个选择器 */}
      <Text className="mb-2 text-lg font-semibold">单个选择器</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        pickers 只有一项时 tab 栏自动隐藏，主按钮直接是「确定」
      </Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setSingleShow(true)}
        >
          选择时间
        </Button>

        <PickerGroup
          pickers={SINGLE_PICKERS}
          show={singleShow}
          onUpdateShow={setSingleShow}
        />
      </View>
    </ScrollView>
  );
};

export { PickerGroupDemo };
