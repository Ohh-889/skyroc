import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Content } from '@radix-ui/react-collapsible';
import { cn } from '@skyroc/utils';
import { collapsibleVariants } from './collapsible-variants';
import type { CollapsibleContentProps } from './types';

const CollapsibleContent = forwardRef<ComponentRef<typeof Content>, CollapsibleContentProps>((props, ref) => {
  const { className, ...rest } = props;

  const { content } = collapsibleVariants();

  const mergedCls = cn(content(), className);

  return (
    <Content
      className={mergedCls}
      data-slot="collapsible-content"
      ref={ref}
      {...rest}
    />
  );
});

CollapsibleContent.displayName = 'CollapsibleContent';

export default CollapsibleContent;
