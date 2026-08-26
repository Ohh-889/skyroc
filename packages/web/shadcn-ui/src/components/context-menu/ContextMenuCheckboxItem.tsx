import { CheckboxItem } from '@radix-ui/react-context-menu';
import MenuCheckboxItem from '../menu/MenuCheckboxItem';
import ContextMenuItemIndicator from './ContextMenuItemIndicator';
import type { ContextMenuCheckboxItemProps } from './types';

const ContextMenuCheckboxItem = (props: ContextMenuCheckboxItemProps) => {
  return (
    <MenuCheckboxItem
      component={CheckboxItem as typeof MenuCheckboxItem}
      indicatorComponent={ContextMenuItemIndicator}
      {...props}
    />
  );
};

export default ContextMenuCheckboxItem;
