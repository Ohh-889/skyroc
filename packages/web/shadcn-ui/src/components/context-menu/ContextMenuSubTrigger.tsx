import { SubTrigger } from '@radix-ui/react-context-menu';
import MenuSubTrigger from '../menu/MenuSubTrigger';
import type { ContextMenuSubTriggerProps } from './types';

const ContextMenuSubTrigger = (props: ContextMenuSubTriggerProps) => {
  return (
    <MenuSubTrigger
      component={SubTrigger as typeof MenuSubTrigger}
      {...props}
    />
  );
};

export default ContextMenuSubTrigger;
