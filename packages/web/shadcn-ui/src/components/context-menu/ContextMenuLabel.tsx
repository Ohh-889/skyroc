import { Label } from '@radix-ui/react-context-menu';
import MenuLabel from '../menu/MenuLabel';
import type { ContextMenuLabelProps } from './types';

const ContextMenuLabel = (props: ContextMenuLabelProps) => {
  return (
    <MenuLabel
      component={Label as typeof MenuLabel}
      {...props}
    />
  );
};

export default ContextMenuLabel;
