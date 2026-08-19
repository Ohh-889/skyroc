import { Text } from '@skyroc/native-ui';
import { ScrollView, View } from 'react-native';
import { TimePickerBasic } from './TimePickerBasic';
import { TimePickerColumns } from './TimePickerColumns';
import { TimePickerFormatter } from './TimePickerFormatter';
import { TimePickerLimit } from './TimePickerLimit';
import { TimePickerPopup } from './TimePickerPopup';
import { TimePickerTrigger } from './TimePickerTrigger';

/** TimePicker 的总览页，逐节复用同目录下的单点 demo，本文件只负责串场。 */
const TimePickerDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="py-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-2 px-6 text-lg font-semibold">基础用法</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        不传 defaultValue 时滚轮停在此刻；默认只有时、分两列
      </Text>
      <View className="mb-4">
        <TimePickerBasic />
      </View>

      {/* 限制可选区间 */}
      <Text className="mb-2 px-6 text-lg font-semibold">限制可选区间</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        min / maxTime 只在首尾小时上收窄分列：停在 09 点分列从 30 起，停在 18 点分列到 15 止，中间的整点仍是 00–59
      </Text>
      <View className="mb-4">
        <TimePickerLimit />
      </View>

      {/* 时分秒三列 */}
      <Text className="mb-2 px-6 text-lg font-semibold">时分秒三列</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        columnsType 决定显示哪几列及其顺序；秒列只有时分同时停在首尾上才会被收窄
      </Text>
      <View className="mb-4">
        <TimePickerColumns />
      </View>

      {/* 格式化与过滤 */}
      <Text className="mb-2 px-6 text-lg font-semibold">格式化与过滤</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        formatter 只改显示文本不改值；filter 挖掉的是候选项本身，这里分钟只留整五分
      </Text>
      <View className="mb-4">
        <TimePickerFormatter />
      </View>

      {/* 弹层用法 */}
      <Text className="mb-2 px-6 text-lg font-semibold">弹层用法</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        与 Picker 同样的提交语义：滚动中的值是临时的，点「确定」才写回，点「取消」直接丢弃
      </Text>
      <View className="mb-4">
        <TimePickerPopup />
      </View>

      {/* 自定义触发元素 */}
      <Text className="mb-2 px-6 text-lg font-semibold">自定义触发元素</Text>
      <Text
        className="mb-4 px-6"
        color="muted"
      >
        children 传函数即可自己画触发元素，回调里能拿到 open 与当前已确认的值
      </Text>
      <View className="mb-4">
        <TimePickerTrigger />
      </View>
    </ScrollView>
  );
};

export { TimePickerDemo };
