import { CommandList as _CommandList } from 'cmdk';
import { cn } from '@skyroc/utils';
import { commandVariants } from './command-variants';
import type { CommandListProps } from './types';

const CommandList = (props: CommandListProps) => {
  const { className, size, ...rest } = props;

  const { list } = commandVariants({ size });

  const mergedClass = cn(list(), className);
  return (
    <_CommandList
      className={mergedClass}
      data-slot="command-list"
      {...rest}
    />
  );
};

export default CommandList;
