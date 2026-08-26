import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { CommandRoot as _CommandRoot } from 'cmdk';
import { cn } from '@skyroc/utils';
import { commandVariants } from './command-variants';
import type { CommandRootProps } from './types';

const CommandRoot = forwardRef<ComponentRef<typeof _CommandRoot>, CommandRootProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { root } = commandVariants({ size });

  const mergedClass = cn(root(), className);
  return (
    <_CommandRoot
      className={mergedClass}
      data-slot="command-root"
      ref={ref}
      {...rest}
    />
  );
});

CommandRoot.displayName = 'CommandRoot';

export default CommandRoot;
