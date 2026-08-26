import MenuShortcut from '../menu/MenuShortcut';
import type { MenubarShortcutProps } from './types';

const MenubarShortcut = (props: MenubarShortcutProps) => {
  const { children, ...rest } = props;

  // Convert ReactNode children to string for MenuShortcut
  const value = typeof children === 'string' ? children : undefined;

  return (
    <MenuShortcut
      value={value}
      {...rest}
    />
  );
};

MenubarShortcut.displayName = 'MenubarShortcut';

export default MenubarShortcut;
