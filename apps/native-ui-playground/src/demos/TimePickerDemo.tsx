import { Button, Cell, Text, TimePicker, TimePickerView } from '@skyroc/native-ui';
import type { TimePickerFilter, TimePickerFormatter } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

/** 各列的中文单位 */
const COLUMN_UNITS = { hour: '时', minute: '分', second: '秒' };

/** 给数字列补上中文单位 */
const CN_FORMATTER: TimePickerFormatter = (type, option) => ({
  ...option,
  label: `${option.label}${COLUMN_UNITS[type]}`
});

/** 分钟只留整五分，用来验证 filter 把中间值挖空后选中值会落到最近的可选项 */
const STEP_MINUTE_FILTER: TimePickerFilter = (columnType, options) => {
  if (columnType !== 'minute') return options;

  return options.filter(option => Number.parseInt(option.value ?? '0', 10) % 5 === 0);
};

const TimePickerDemo = () => {
  const [alarmShow, setAlarmShow] = useState(false);
  const [alarm, setAlarm] = useState<string[]>(['07', '30']);
  const [meetingShow, setMeetingShow] = useState(false);
  const [meeting, setMeeting] = useState<string[]>([]);

  const alarmLabel = alarm.length > 0 ? alarm.join(':') : '请选择';
  const meetingLabel = meeting.length > 0 ? meeting.join(':') : '请选择';

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
        不传 defaultValue 时滚轮停在此刻；默认只有时、分两列
      </Text>
      <View className="mb-8">
        <TimePickerView showToolbar={false} />
      </View>

      {/* 限制可选区间 */}
      <Text className="mb-2 text-lg font-semibold">限制可选区间</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        min / maxTime 只在首尾小时上收窄分列：停在 09 点分列从 30 起，停在 18 点分列到 15 止，中间的整点仍是 00–59
      </Text>
      <View className="mb-8">
        <TimePickerView
          showToolbar={false}
          defaultValue={['08', '00']}
          maxTime="18:15:00"
          minTime="09:30:00"
        />
      </View>

      {/* 时分秒三列 */}
      <Text className="mb-2 text-lg font-semibold">时分秒三列</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        columnsType 决定显示哪几列及其顺序；秒列只有时分同时停在首尾上才会被收窄
      </Text>
      <View className="mb-8">
        <TimePickerView
          columnsType={['hour', 'minute', 'second']}
          showToolbar={false}
          maxTime="12:00:30"
          minTime="10:00:00"
        />
      </View>

      {/* 格式化与过滤 */}
      <Text className="mb-2 text-lg font-semibold">格式化与过滤</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        formatter 只改显示文本不改值；filter 挖掉的是候选项本身，这里分钟只留整五分
      </Text>
      <View className="mb-8">
        <TimePickerView
          filter={STEP_MINUTE_FILTER}
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
          onPress={() => setMeetingShow(true)}
        >
          选择会议时间
        </Button>
        <Text color="muted">当前：{meetingLabel}</Text>

        <TimePicker
          show={meetingShow}
          title="会议时间"
          value={meeting}
          filter={STEP_MINUTE_FILTER}
          maxTime="18:00:00"
          minTime="09:00:00"
          onConfirm={setMeeting}
          onUpdateShow={setMeetingShow}
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
    </ScrollView>
  );
};

export { TimePickerDemo };
