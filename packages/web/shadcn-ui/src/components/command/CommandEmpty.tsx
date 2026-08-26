import { CommandEmpty as _CommandEmpty } from 'cmdk';
import { cn } from '@skyroc/utils';
import { commandVariants } from './command-variants';
import type { CommandEmptyProps } from './types';

const CommandEmpty = (props: CommandEmptyProps) => {
  const { className, size, ...rest } = props;

  const { empty } = commandVariants({ size });

  const mergedClass = cn(empty(), className);
  return (
    <_CommandEmpty
      className={mergedClass}
      data-slot="command-empty"
      {...rest}
    />
  );
};

export default CommandEmpty;
