import { Calendar, Text } from '@skyroc/native-ui';
import type { DateType } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

/** 一天的毫秒数，用于算出「今天起 30 天」这类相对区间 */
const DAY_IN_MS = 24 * 60 * 60 * 1000;

/** 把 DateType 格式化成 YYYY-MM-DD */
function formatDate(date: DateType): string {
  if (!date) return '未选择';

  const parsed = new Date(date as Date | number | string);

  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');

  return `${parsed.getFullYear()}-${month}-${day}`;
}

const CalendarDemo = () => {
  const [singleDate, setSingleDate] = useState<DateType>(new Date());
  const [rangeStart, setRangeStart] = useState<DateType>();
  const [rangeEnd, setRangeEnd] = useState<DateType>();
  const [multiDates, setMultiDates] = useState<DateType[]>([]);
  const [limitedDate, setLimitedDate] = useState<DateType>(new Date());
  const [themedDate, setThemedDate] = useState<DateType>(new Date());

  const rangeLabel = `${rangeStart ? formatDate(rangeStart) : '开始'} ~ ${rangeEnd ? formatDate(rangeEnd) : '结束'}`;

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
        mode 决定交互形态，single 下由 date / onChange 组成受控对；当前选中 {formatDate(singleDate)}
      </Text>
      <View className="mb-8">
        <Calendar
          date={singleDate}
          locale="zh"
          mode="single"
          onChange={({ date }) => setSingleDate(date)}
        />
      </View>

      {/* 日期范围 */}
      <Text className="mb-2 text-lg font-semibold">日期范围</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        range 模式下 onChange 一次回传首尾两端，中途只选了开始日期时 endDate 为空：{rangeLabel}
      </Text>
      <View className="mb-8">
        <Calendar
          endDate={rangeEnd}
          locale="zh"
          mode="range"
          startDate={rangeStart}
          onChange={({ endDate, startDate }) => {
            setRangeStart(startDate);
            setRangeEnd(endDate);
          }}
        />
      </View>

      {/* 多选 */}
      <Text className="mb-2 text-lg font-semibold">多选</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        multiple 模式回传整份已选数组，再点一次已选中的日期即为取消，已选 {multiDates.length} 天
      </Text>
      <View className="mb-8">
        <Calendar
          dates={multiDates}
          locale="zh"
          mode="multiple"
          onChange={({ dates }) => setMultiDates(dates)}
        />
      </View>

      {/* 限制可选范围 */}
      <Text className="mb-2 text-lg font-semibold">限制可选范围</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        min / maxDate 之外的日期会被置灰且点不动，这里只放开今天起的 30 天：{formatDate(limitedDate)}
      </Text>
      <View className="mb-8">
        <Calendar
          date={limitedDate}
          locale="zh"
          maxDate={new Date(Date.now() + 30 * DAY_IN_MS)}
          minDate={new Date()}
          mode="single"
          onChange={({ date }) => setLimitedDate(date)}
        />
      </View>

      {/* 隐藏头部与周首日 */}
      <Text className="mb-2 text-lg font-semibold">周首日与外月日期</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        firstDayOfWeek 改成周一，showOutsideDays 关掉后当月之外的格子留空而不是显示上下月日期
      </Text>
      <View className="mb-8">
        <Calendar
          showOutsideDays={false}
          date={themedDate}
          firstDayOfWeek={1}
          locale="zh"
          mode="single"
          onChange={({ date }) => setThemedDate(date)}
        />
      </View>

      {/* 自定义样式 */}
      <Text className="mb-2 text-lg font-semibold">自定义样式</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        classNames 是按 slot 叠加而不是整段替换：这里只写了圆角和选中底色，日期格子原有的排版仍在
      </Text>
      <View className="mb-8">
        <Calendar
          date={themedDate}
          locale="zh"
          mode="single"
          className="border border-border bg-muted/30"
          classNames={{
            day: 'rounded-full',
            selected: 'bg-success',
            today: 'bg-warning/20'
          }}
          onChange={({ date }) => setThemedDate(date)}
        />
      </View>
    </ScrollView>
  );
};

export { CalendarDemo };
