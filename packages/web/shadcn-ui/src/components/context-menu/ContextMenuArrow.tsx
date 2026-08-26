import { Arrow } from '@radix-ui/react-context-menu';
import MenuArrow from '../menu/MenuArrow';
import type { ContextMenuArrowProps } from './types';

const ContextMenuArrow = (props: ContextMenuArrowProps) => {
  return (
    <MenuArrow
      {...props}
      component={Arrow as typeof MenuArrow}
    />
  );
};

export default ContextMenuArrow;
