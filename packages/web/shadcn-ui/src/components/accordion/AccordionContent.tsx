import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Content } from '@radix-ui/react-accordion';
import { cn } from '@skyroc/utils';
import { accordionVariants } from './accordion-variants';
import type { AccordionContentProps } from './types';

const AccordionContent = forwardRef<ComponentRef<typeof Content>, AccordionContentProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { content } = accordionVariants({ size });

  const mergedCls = cn(content(), className);

  return (
    <Content
      className={mergedCls}
      data-slot="accordion-content"
      ref={ref}
      {...rest}
    />
  );
});
AccordionContent.displayName = Content.displayName;

export default AccordionContent;
