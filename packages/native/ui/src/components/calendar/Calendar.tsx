import DateTimePicker, { useDefaultClassNames } from 'react-native-ui-datepicker';
import { cn } from '@skyroc/utils';
import { calendarVariants } from './calendar-variants';
import type { CalendarProps } from './types';

const Calendar = (props: CalendarProps) => {
  const { className, classNames, ...rest } = props;

  const slots = calendarVariants();
  const defaultClassNames = useDefaultClassNames();

  return (
    <DateTimePicker
      className={cn(slots.root(), className)}
      classNames={{ ...defaultClassNames, ...classNames }}
      {...rest}
    />
  );
};

export { Calendar };
