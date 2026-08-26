import { cn } from '@skyroc/utils';
import KeyboardKey from '../keyboard-key/KeyboardKeyUI';
import type { KbdValue } from '../keyboard-key/types';
import { commandVariants } from './command-variants';
import type { CommandShortcutProps } from './types';

const CommandShortcut = (props: CommandShortcutProps) => {
  const { children, className, size, value, ...rest } = props;

  const { shortcut } = commandVariants({ size });

  const mergedClass = cn(shortcut(), className);

  return (
    <div
      className={mergedClass}
      data-slot="command-shortcut"
      {...rest}
    >
      {children || (
        <KeyboardKey
          size={size}
          value={value as KbdValue}
        />
      )}
    </div>
  );
};

export default CommandShortcut;
