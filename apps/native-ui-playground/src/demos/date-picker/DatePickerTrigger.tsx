import { Cell, DatePicker } from '@skyroc/native-ui';
import type { DatePickerFormatter } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** 各列的中文单位 */
const COLUMN_UNITS = { day: '日', month: '月', year: '年' };

/** 给数字列补上中文单位 */
const CN_FORMATTER: DatePickerFormatter = (type, option) => ({
  ...option,
  label: `${option.label}${COLUMN_UNITS[type]}`
});

const DatePickerTrigger = () => {
  const [show, setShow] = useState(false);
  const [birthday, setBirthday] = useState<string[]>(['1998', '06', '15']);

  const birthdayLabel = birthday.length > 0 ? birthday.join('-') : '请选择';

  return (
    <View className="bg-background p-4">
      <DatePicker
        formatter={CN_FORMATTER}
        show={show}
        title="选择生日"
        value={birthday}
        maxDate={new Date()}
        minDate={new Date(1950, 0, 1)}
        onConfirm={setBirthday}
        onUpdateShow={setShow}
      >
        {args => (
          <Cell
            showArrow
            title="出生日期"
            trailing={birthdayLabel}
            onPress={args.open}
          />
        )}
      </DatePicker>
    </View>
  );
};

export { DatePickerTrigger };
