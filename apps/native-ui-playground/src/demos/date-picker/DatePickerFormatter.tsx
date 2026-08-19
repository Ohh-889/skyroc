import { DatePickerView } from '@skyroc/native-ui';
import type { DatePickerFilter, DatePickerFormatter as DatePickerFormatterFn } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 各列的中文单位 */
const COLUMN_UNITS = { day: '日', month: '月', year: '年' };

/** 给数字列补上中文单位 */
const CN_FORMATTER: DatePickerFormatterFn = (type, option) => ({
  ...option,
  label: `${option.label}${COLUMN_UNITS[type]}`
});

/** 只保留双数日，用来验证 filter 把中间值挖空后选中值会落到最近的可选项 */
const EVEN_DAY_FILTER: DatePickerFilter = (columnType, options) => {
  if (columnType !== 'day') return options;

  return options.filter(option => Number.parseInt(option.value ?? '0', 10) % 2 === 0);
};

const DatePickerFormatter = () => {
  return (
    <View className="bg-background p-4">
      <DatePickerView
        filter={EVEN_DAY_FILTER}
        formatter={CN_FORMATTER}
        showToolbar={false}
      />
    </View>
  );
};

export { DatePickerFormatter };
