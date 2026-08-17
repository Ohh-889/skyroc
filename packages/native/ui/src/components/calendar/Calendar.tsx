import DateTimePicker, { useDefaultClassNames } from 'react-native-ui-datepicker';
import { cn } from '@skyroc/utils';
import { calendarVariants } from './calendar-variants';
import type { CalendarClassNames, CalendarProps } from './types';

/**
 * 逐个 slot 合并类名，而不是整段替换。
 *
 * 第三方的默认类名里同时带着排版（`p-0.5`、`rounded-md`）和配色，整段替换意味着调用方
 * 只想换个圆角就得把排版重新抄一遍。走 cn 之后冲突的工具类由 tailwind-merge 决定胜负，
 * 不冲突的部分保留。
 */
function mergeClassNames(defaults: CalendarClassNames, overrides?: CalendarClassNames): CalendarClassNames {
  if (!overrides) return defaults;

  const merged: CalendarClassNames = { ...defaults };

  for (const key of Object.keys(overrides) as (keyof CalendarClassNames)[]) {
    merged[key] = cn(defaults[key], overrides[key]);
  }

  return merged;
}

/**
 * 月历，基于 react-native-ui-datepicker 封装。
 *
 * 之所以只做薄薄一层：它自带的默认类名用的就是 `bg-primary` / `text-primary-foreground` /
 * `text-muted-foreground` / `bg-accent` 这套语义 token，与本仓库 tailwind-plugin 生成的
 * 变量同名，配色天然对得上，不需要再翻译一遍。这一层负责的是面板容器样式与类名合并策略。
 */
const Calendar = (props: CalendarProps) => {
  const { className, classNames, ...rest } = props;

  const defaultClassNames = useDefaultClassNames();

  const slots = calendarVariants();

  return (
    <DateTimePicker
      {...rest}
      className={cn(slots.root(), className)}
      classNames={mergeClassNames(defaultClassNames, classNames)}
    />
  );
};

export { Calendar };
