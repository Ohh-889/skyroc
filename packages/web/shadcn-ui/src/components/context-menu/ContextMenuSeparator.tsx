import { Separator } from '@radix-ui/react-context-menu';
import MenuSeparator from '../menu/MenuSeparator';
import type { ContextMenuSeparatorProps } from './types';

const ContextMenuSeparator = (props: ContextMenuSeparatorProps) => {
  return (
    <MenuSeparator
      component={Separator as typeof MenuSeparator}
      {...props}
    />
  );
};

export default ContextMenuSeparator;
