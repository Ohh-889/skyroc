import { cn } from '@skyroc/utils';
import { CommandGroup as _CommandGroup } from 'cmdk';
import { commandVariants } from './command-variants';
import type { CommandGroupProps } from './types';

const CommandGroup = (props: CommandGroupProps) => {
  const { children, className, classNames, heading, size, ...rest } = props;

  const { group, groupLabel } = commandVariants({ size });

  const mergedClass = cn(group(), className || classNames?.group);

  const mergedLabelClass = cn(groupLabel(), classNames?.groupLabel);

  return (
    <_CommandGroup className={mergedClass} data-slot="command-group" {...rest}>
      {heading ? <div className={mergedLabelClass}>{heading}</div> : null}
      {children}
    </_CommandGroup>
  );
};

export default CommandGroup;
