import { RadioItem } from '@radix-ui/react-context-menu';
import MenuRadioItem from '../menu/MenuRadioItem';
import ContextMenuItemIndicator from './ContextMenuItemIndicator';
import type { ContextMenuRadioItemProps } from './types';

const ContextMenuRadioItem = (props: ContextMenuRadioItemProps) => {
  return (
    <MenuRadioItem
      component={RadioItem}
      indicatorComponent={ContextMenuItemIndicator}
      {...props}
    />
  );
};

export default ContextMenuRadioItem;
