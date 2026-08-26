import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Root } from '@radix-ui/react-accordion';
import { cn } from '@skyroc/utils';
import { accordionVariants } from './accordion-variants';
import type { AccordionRootProps } from './types';

const AccordionRoot = forwardRef<ComponentRef<typeof Root>, AccordionRootProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { root } = accordionVariants({ size });

  const mergedCls = cn(root(), className);

  return (
    <Root
      className={mergedCls}
      data-slot="accordion-root"
      ref={ref}
      {...rest}
    />
  );
});
AccordionRoot.displayName = Root.displayName;

export default AccordionRoot;
