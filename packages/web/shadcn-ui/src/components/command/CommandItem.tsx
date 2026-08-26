import { isValidElement } from 'react';
import { CommandItem as _CommandItem } from 'cmdk';
import { cn } from '@skyroc/utils';
import { withClassName } from '@skyroc/utils/web';
import CommandShortcut from './CommandShortcut';
import { commandVariants } from './command-variants';
import type { CommandItemProps } from './types';

const CommandItem = (props: CommandItemProps) => {
  const { children, className, leading, shortcut, size, trailing, ...rest } = props;

  const { item, itemIcon } = commandVariants({ size });

  const mergedClass = cn(item(), className);

  return (
    <_CommandItem
      className={mergedClass}
      data-slot="command-item"
      {...rest}
    >
      {isValidElement(leading) ? withClassName(leading, itemIcon()) : leading}
      {children}
      {trailing}

      {shortcut
        ? (
          <CommandShortcut
            size={size}
            value={shortcut}
          />
        )
        : null}
    </_CommandItem>
  );
};

export default CommandItem;
