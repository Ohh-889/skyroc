'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import CommandEmpty from './CommandEmpty';
import CommandInput from './CommandInput';
import CommandList from './CommandList';
import CommandOption from './CommandOption';
import CommandRoot from './CommandRoot';
import type { CommandProps } from './types';

const CommandUI = forwardRef<ComponentRef<typeof CommandRoot>, CommandProps>((props, ref) => {
  const { className, classNames, empty = 'No results.', inputProps, items, size, ...rest } = props;

  return (
    <CommandRoot
      {...rest}
      className={className || classNames?.root}
      ref={ref}
    >
      <CommandInput
        classNames={classNames}
        size={size}
        {...inputProps}
      />

      <CommandList
        className={classNames?.list}
        size={size}
      >
        <CommandEmpty
          className={classNames?.empty}
          size={size}
        >
          {empty}
        </CommandEmpty>

        {items.map((item, index) => (
          <CommandOption
            classNames={classNames}
            item={item}
            key={String(index)}
            size={size}
          />
        ))}
      </CommandList>
    </CommandRoot>
  );
});

CommandUI.displayName = 'CommandUI';

export default CommandUI;