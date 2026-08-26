import { Group } from '@radix-ui/react-context-menu';
import MenuCheckboxGroup from '../menu/MenuCheckboxGroup';
import ContextMenuCheckboxItem from './ContextMenuCheckboxItem';
import ContextMenuLabel from './ContextMenuLabel';
import ContextMenuSeparator from './ContextMenuSeparator';
import type { ContextMenuCheckboxGroupProps } from './types';

const ContextMenuCheckboxGroup = (props: ContextMenuCheckboxGroupProps) => {
  return (
    <MenuCheckboxGroup
      component={ContextMenuCheckboxItem}
      groupComponent={Group}
      labelComponent={ContextMenuLabel}
      separatorComponent={ContextMenuSeparator}
      {...props}
    />
  );
};

export default ContextMenuCheckboxGroup;
