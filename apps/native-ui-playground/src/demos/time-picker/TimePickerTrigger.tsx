import { Cell, TimePicker } from '@skyroc/native-ui';
import type { TimePickerFormatter } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** 各列的中文单位 */
const COLUMN_UNITS = { hour: '时', minute: '分', second: '秒' };

/** 给数字列补上中文单位 */
const CN_FORMATTER: TimePickerFormatter = (type, option) => ({
  ...option,
  label: `${option.label}${COLUMN_UNITS[type]}`
});

const TimePickerTrigger = () => {
  const [alarmShow, setAlarmShow] = useState(false);
  const [alarm, setAlarm] = useState<string[]>(['07', '30']);

  const alarmLabel = alarm.length > 0 ? alarm.join(':') : '请选择';

  return (
    <View className="bg-background px-6 py-4">
      <TimePicker
        formatter={CN_FORMATTER}
        show={alarmShow}
        title="设置闹钟"
        value={alarm}
        onConfirm={setAlarm}
        onUpdateShow={setAlarmShow}
      >
        {args => (
          <Cell
            showArrow
            title="起床闹钟"
            trailing={alarmLabel}
            onPress={args.open}
          />
        )}
      </TimePicker>
    </View>
  );
};

export { TimePickerTrigger };
