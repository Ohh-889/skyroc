import { PanelLeft } from 'lucide-react';
import { cn } from '@skyroc/utils';
import { ButtonIcon } from '../button';
import { useLayoutContext } from './context';
import { layoutVariants } from './layout-variants';
import type { LayoutTriggerProps } from './types';

const LayoutTrigger = (props: LayoutTriggerProps) => {
  const { className, ...rest } = props;
  const { trigger } = layoutVariants();
  const mergedCls = cn(trigger(), className);
  const { toggleSidebar } = useLayoutContext();
  return (
    <ButtonIcon
      className={mergedCls}
      {...rest}
      onClick={toggleSidebar}
    >
      <PanelLeft />
    </ButtonIcon>
  );
};

export default LayoutTrigger;
