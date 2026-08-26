import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Root } from '@radix-ui/react-collapsible';
import { cn } from '@skyroc/utils';
import { collapsibleVariants } from './collapsible-variants';
import type { CollapsibleRootProps } from './types';

const CollapsibleRoot = forwardRef<ComponentRef<typeof Root>, CollapsibleRootProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { root } = collapsibleVariants({ size });

  const mergedCls = cn(root(), className);

  return (
    <Root
      className={mergedCls}
      data-slot="collapsible-root"
      ref={ref}
      {...rest}
    />
  );
});

CollapsibleRoot.displayName = 'CollapsibleRoot';

export default CollapsibleRoot;
