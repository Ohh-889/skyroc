import { Divider, Text } from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { CalendarBasic } from './CalendarBasic';
import { CalendarControlledMonth } from './CalendarControlledMonth';
import { CalendarCustom } from './CalendarCustom';
import { CalendarDisabledDates } from './CalendarDisabledDates';
import { CalendarLayout } from './CalendarLayout';
import { CalendarMinMax } from './CalendarMinMax';
import { CalendarMultiple } from './CalendarMultiple';
import { CalendarRange } from './CalendarRange';
import { CalendarTimePicker } from './CalendarTimePicker';

interface DemoSectionProps {
  /** 当前示例的日历内容 */
  children: ReactNode;
  /** 解释当前重点 prop 与可观察行为 */
  description: string;
  /** 当前示例的能力标题 */
  title: string;
}

/**
 * Calendar 文档示例的统一段落容器。
 *
 * 刻意不复用 src/components/Section：这里标题在卡片外、每节下方还有一条 Divider，换成共享版会改变外观。
 */
const DemoSection = (props: DemoSectionProps) => {
  const { children, description, title } = props;

  return (
    <View>
      <Text className="mb-2 text-lg font-semibold text-foreground">{title}</Text>
      <Text
        className="mb-4 leading-6"
        color="muted"
      >
        {description}
      </Text>
      <View className="overflow-hidden rounded-3xl border border-border bg-background">{children}</View>
      <Divider className="my-8" />
    </View>
  );
};

/**
 * Calendar 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/calendar/CalendarRange" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const CalendarDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <DemoSection
        description="single 模式通过 date / onChange 受控。"
        title="基础用法 · mode='single'"
      >
        <CalendarBasic />
      </DemoSection>

      <DemoSection
        description="range 使用 startDate / endDate；allowRangeReset 让完整区间后的下一次点击直接开始新区间。"
        title="日期范围 · mode='range'"
      >
        <CalendarRange />
      </DemoSection>

      <DemoSection
        description="multiple 使用 dates 保存整份结果；max={3} 到上限后继续点击不会新增。"
        title="多选与数量限制 · dates / max"
      >
        <CalendarMultiple />
      </DemoSection>

      <DemoSection
        description="disabledDates 支持日期数组或判断函数；本例禁用每个周六、周日。"
        title="禁用日期 · disabledDates"
      >
        <CalendarDisabledDates />
      </DemoSection>

      <DemoSection
        description="minDate / maxDate 约束日期边界，本例仅开放今天起 30 天。"
        title="可选区间 · minDate / maxDate"
      >
        <CalendarMinMax />
      </DemoSection>

      <DemoSection
        description="firstDayOfWeek={1} 以周一开头；showOutsideDays={false} 隐藏外月日期；navigationPosition='right' 集中导航按钮。"
        title="周与导航布局"
      >
        <CalendarLayout />
      </DemoSection>

      <DemoSection
        description="timePicker 在单选日历中加入时间视图，use12Hours 切换为 12 小时制。"
        title="日期与时间 · timePicker"
      >
        <CalendarTimePicker />
      </DemoSection>

      <DemoSection
        description="month / year 可由外部定位显示月份；本例隐藏内置头部并使用独立按钮控制。"
        title="外部控制月份 · month / year"
      >
        <CalendarControlledMonth />
      </DemoSection>

      <Text className="mb-2 text-lg font-semibold text-foreground">自定义内容与样式 · components / classNames</Text>
      <Text
        className="mb-4 leading-6"
        color="muted"
      >
        components.Day 完全接管日期内容与状态；classNames 继续按 slot 定制组件仍负责渲染的头部与星期。
      </Text>
      <CalendarCustom />
    </ScrollView>
  );
};

export { CalendarDemo };
