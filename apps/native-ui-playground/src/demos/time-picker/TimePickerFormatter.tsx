import { TimePickerView } from '@skyroc/native-ui';
import type { TimePickerFilter, TimePickerFormatter as TimePickerFormatterType } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 各列的中文单位 */
const COLUMN_UNITS = { hour: '时', minute: '分', second: '秒' };

/** 给数字列补上中文单位 */
const CN_FORMATTER: TimePickerFormatterType = (type, option) => ({
  ...option,
  label: `${option.label}${COLUMN_UNITS[type]}`
});

/** 分钟只留整五分，用来验证 filter 把中间值挖空后选中值会落到最近的可选项 */
const STEP_MINUTE_FILTER: TimePickerFilter = (columnType, options) => {
  if (columnType !== 'minute') return options;

  return options.filter(option => Number.parseInt(option.value ?? '0', 10) % 5 === 0);
};

const TimePickerFormatter = () => {
  return (
    <View className="bg-background px-6 py-4">
      <TimePickerView
        filter={STEP_MINUTE_FILTER}
        formatter={CN_FORMATTER}
        showToolbar={false}
      />
    </View>
  );
};

export { TimePickerFormatter };
