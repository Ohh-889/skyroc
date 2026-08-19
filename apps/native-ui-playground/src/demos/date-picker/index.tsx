import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { DatePickerBasic } from './DatePickerBasic';
import { DatePickerColumns } from './DatePickerColumns';
import { DatePickerFormatter } from './DatePickerFormatter';
import { DatePickerPopup } from './DatePickerPopup';
import { DatePickerRange } from './DatePickerRange';
import { DatePickerTrigger } from './DatePickerTrigger';

/**
 * DatePicker 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/date-picker/DatePickerRange" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const DatePickerDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="不传 defaultValue 时滚轮停在今天；月列与日列的范围随年月联动，2 月只有 28 / 29 天"
        title="基础用法"
      >
        <DatePickerBasic />
      </Section>

      <Section
        description="min / maxDate 只在首尾年份上收窄月列、首尾月份上收窄日列；选中值超出区间会被钳到最近的可选项"
        title="限制可选区间"
      >
        <DatePickerRange />
      </Section>

      <Section
        description="columnsType 决定显示哪几列及其顺序，缺列时用今天的对应值补位"
        title="只选年月"
      >
        <DatePickerColumns />
      </Section>

      <Section
        description="formatter 只改显示文本不改值；filter 挖掉的是候选项本身，这里只留双数日"
        title="格式化与过滤"
      >
        <DatePickerFormatter />
      </Section>

      <Section
        description="与 Picker 同样的提交语义：滚动中的值是临时的，点「确定」才写回，点「取消」直接丢弃"
        title="弹层用法"
      >
        <DatePickerPopup />
      </Section>

      <Section
        description="children 传函数即可自己画触发元素，回调里能拿到 open 与当前已确认的值"
        title="自定义触发元素"
      >
        <DatePickerTrigger />
      </Section>
    </ScrollView>
  );
};

export { DatePickerDemo };
