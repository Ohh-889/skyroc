import { Button, Cell, DatePicker, DatePickerView, Text } from '@skyroc/native-ui';
import type { DatePickerFilter, DatePickerFormatter } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

/** 各列的中文单位 */
const COLUMN_UNITS = { day: '日', month: '月', year: '年' };

/** 给数字列补上中文单位 */
const CN_FORMATTER: DatePickerFormatter = (type, option) => ({
  ...option,
  label: `${option.label}${COLUMN_UNITS[type]}`
});

/** 只保留双数日，用来验证 filter 把中间值挖空后选中值会落到最近的可选项 */
const EVEN_DAY_FILTER: DatePickerFilter = (columnType, options) => {
  if (columnType !== 'day') return options;

  return options.filter(option => Number.parseInt(option.value ?? '0', 10) % 2 === 0);
};

const CURRENT_YEAR = new Date().getFullYear();

const DatePickerDemo = () => {
  const [birthdayShow, setBirthdayShow] = useState(false);
  const [birthday, setBirthday] = useState<string[]>(['1998', '06', '15']);
  const [checkInShow, setCheckInShow] = useState(false);
  const [checkIn, setCheckIn] = useState<string[]>([]);

  const birthdayLabel = birthday.length > 0 ? birthday.join('-') : '请选择';
  const checkInLabel = checkIn.length > 0 ? checkIn.join('-') : '请选择';

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
        不传 defaultValue 时滚轮停在今天；月列与日列的范围随年月联动，2 月只有 28 / 29 天
      </Text>
      <View className="mb-8">
        <DatePickerView showToolbar={false} />
      </View>

      {/* 限制可选区间 */}
      <Text className="mb-2 text-lg font-semibold">限制可选区间</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        min / maxDate 只在首尾年份上收窄月列、首尾月份上收窄日列；选中值超出区间会被钳到最近的可选项
      </Text>
      <View className="mb-8">
        <DatePickerView
          showToolbar={false}
          maxDate={new Date(CURRENT_YEAR, 11, 20)}
          minDate={new Date(CURRENT_YEAR, 0, 10)}
        />
      </View>

      {/* 只选年月 */}
      <Text className="mb-2 text-lg font-semibold">只选年月</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        columnsType 决定显示哪几列及其顺序，缺列时用今天的对应值补位
      </Text>
      <View className="mb-8">
        <DatePickerView
          columnsType={['year', 'month']}
          showToolbar={false}
          title="选择月份"
        />
      </View>

      {/* 格式化与过滤 */}
      <Text className="mb-2 text-lg font-semibold">格式化与过滤</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        formatter 只改显示文本不改值；filter 挖掉的是候选项本身，这里只留双数日
      </Text>
      <View className="mb-8">
        <DatePickerView
          filter={EVEN_DAY_FILTER}
          formatter={CN_FORMATTER}
          showToolbar={false}
        />
      </View>

      {/* 弹层用法 */}
      <Text className="mb-2 text-lg font-semibold">弹层用法</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        与 Picker 同样的提交语义：滚动中的值是临时的，点「确定」才写回，点「取消」直接丢弃
      </Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setCheckInShow(true)}
        >
          选择入住日期
        </Button>
        <Text color="muted">当前：{checkInLabel}</Text>

        <DatePicker
          show={checkInShow}
          title="入住日期"
          value={checkIn}
          minDate={new Date()}
          onConfirm={setCheckIn}
          onUpdateShow={setCheckInShow}
        />
      </View>

      {/* 自定义触发元素 */}
      <Text className="mb-2 text-lg font-semibold">自定义触发元素</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        children 传函数即可自己画触发元素，回调里能拿到 open 与当前已确认的值
      </Text>
      <View className="mb-8">
        <DatePicker
          formatter={CN_FORMATTER}
          show={birthdayShow}
          title="选择生日"
          value={birthday}
          maxDate={new Date()}
          minDate={new Date(1950, 0, 1)}
          onConfirm={setBirthday}
          onUpdateShow={setBirthdayShow}
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
    </ScrollView>
  );
};

export { DatePickerDemo };
