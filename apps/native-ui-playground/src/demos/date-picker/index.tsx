import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { DatePickerBasic } from './DatePickerBasic';
import { DatePickerColumns } from './DatePickerColumns';
import { DatePickerControlled } from './DatePickerControlled';
import { DatePickerFormatter } from './DatePickerFormatter';
import { DatePickerLoading } from './DatePickerLoading';
import { DatePickerPopup } from './DatePickerPopup';
import { DatePickerRange } from './DatePickerRange';
import { DatePickerToolbar } from './DatePickerToolbar';
import { DatePickerTrigger } from './DatePickerTrigger';
import { DatePickerWheel } from './DatePickerWheel';

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
        description="value / onChange 组成受控模式；滚动任意一列后，外部值与滚轮选择保持同步"
        title="受控模式 · value / onChange"
      >
        <DatePickerControlled />
      </Section>

      <Section
        description="min / maxDate 只在首尾年份上收窄月列、首尾月份上收窄日列；选中值超出区间会被钳到最近的可选项"
        title="可选区间 · minDate / maxDate"
      >
        <DatePickerRange />
      </Section>

      <Section
        description="columnsType 决定显示的列与排列顺序；本例只保留月、日两列"
        title="列组合 · columnsType"
      >
        <DatePickerColumns />
      </Section>

      <Section
        description="formatter 只改显示文本不改值；filter 挖掉的是候选项本身，这里只留双数日"
        title="格式化与过滤 · formatter / filter"
      >
        <DatePickerFormatter />
      </Section>

      <Section
        description="itemHeight 与 visibleCount 控制滚轮密度，haptic 开启逐格触感；classNames 可覆盖公开 slot 样式"
        title="滚轮外观与反馈"
      >
        <DatePickerWheel />
      </Section>

      <Section
        description="loading 在滚轮区域显示加载遮罩，并保留组件原有尺寸"
        title="加载状态 · loading"
      >
        <DatePickerLoading />
      </Section>

      <Section
        description="title、cancelText 与 confirmText 定制工具栏；onCancel / onConfirm 返回当前选中值"
        title="工具栏与回调"
      >
        <DatePickerToolbar />
      </Section>

      <Section
        description="弹层滚动值只在确定后写回；取消会丢弃临时选择。showHandle 与 enablePanDownToClose 共同开启下拉关闭"
        title="弹层提交与关闭"
      >
        <DatePickerPopup />
      </Section>

      <Section
        description="children 传函数即可自己画触发元素，回调里能拿到 open 与当前已确认的值"
        title="自定义触发元素 · children"
      >
        <DatePickerTrigger />
      </Section>
    </ScrollView>
  );
};

export { DatePickerDemo };
