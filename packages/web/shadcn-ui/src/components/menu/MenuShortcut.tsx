import { cn } from '@skyroc/utils';
import type { KbdValue } from '../keyboard-key';
import { KeyboardKey } from '../keyboard-key';
import { menuVariants } from './menu-variants';
import type { MenuShortcutProps } from './types';

const MenuShortcut = (props: MenuShortcutProps) => {
  const { className, size, value, ...rest } = props;

  const { shortcut } = menuVariants({ size });

  const mergedCls = cn(shortcut(), className);

  return (
    <div
      className={mergedCls}
      {...rest}
    >
      <KeyboardKey
        size={size}
        value={value as KbdValue}
      />
    </div>
  );
};

MenuShortcut.displayName = 'MenuShortcut';

export default MenuShortcut;
