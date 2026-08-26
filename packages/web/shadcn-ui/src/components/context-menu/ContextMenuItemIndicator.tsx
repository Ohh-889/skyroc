import { ItemIndicator } from '@radix-ui/react-context-menu';
import MenuItemIndicator from '../menu/MenuItemIndicator';
import type { ContextMenuItemIndicatorProps } from './types';

const ContextMenuItemIndicator = (props: ContextMenuItemIndicatorProps) => {
  return (
    <MenuItemIndicator
      component={ItemIndicator as typeof MenuItemIndicator}
      {...props}
    />
  );
};

export default ContextMenuItemIndicator;
