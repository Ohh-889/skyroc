import { Button, Text, TimePicker } from '@skyroc/native-ui';
import type { TimePickerFilter } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** 分钟只留整五分，用来验证 filter 把中间值挖空后选中值会落到最近的可选项 */
const STEP_MINUTE_FILTER: TimePickerFilter = (columnType, options) => {
  if (columnType !== 'minute') return options;

  return options.filter(option => Number.parseInt(option.value ?? '0', 10) % 5 === 0);
};

const TimePickerPopup = () => {
  const [meetingShow, setMeetingShow] = useState(false);
  const [meeting, setMeeting] = useState<string[]>([]);

  const meetingLabel = meeting.length > 0 ? meeting.join(':') : '请选择';

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background px-6 py-4">
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
  );
};

export { TimePickerPopup };
