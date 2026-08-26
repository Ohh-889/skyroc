import { Sub } from '@radix-ui/react-context-menu';
import MenuOption from '../menu/MenuOption';
import ContextMenuItem from './ContextMenuItem';
import ContextMenuLabel from './ContextMenuLabel';
import ContextMenuSeparator from './ContextMenuSeparator';
import ContextMenuSubContent from './ContextMenuSubContent';
import ContextMenuSubTrigger from './ContextMenuSubTrigger';
import type { ContextMenuOptionProps } from './types';

const ContextMenuOption = (props: ContextMenuOptionProps) => {
  return (
    <MenuOption
      {...props}
      component={ContextMenuItem}
      labelComponent={ContextMenuLabel}
      separatorComponent={ContextMenuSeparator}
      subComponent={Sub}
      subContentComponent={ContextMenuSubContent}
      subTriggerComponent={ContextMenuSubTrigger}
    />
  );
};

ContextMenuOption.displayName = 'ContextMenuOption';

export default ContextMenuOption;
