import { forwardRef } from 'react';
import { cn } from '@skyroc/utils';
import { badgeVariants } from './badge-variants';
import type { BadgeRootProps } from './types';

const BadgeRoot = forwardRef<HTMLDivElement, BadgeRootProps>((props, ref) => {
  const { className, ...rest } = props;

  const { root } = badgeVariants();

  const mergedCls = cn(root(), className);

  return (
    <div
      className={mergedCls}
      data-slot="badge-root"
      ref={ref}
      {...rest}
    />
  );
});

BadgeRoot.displayName = 'BadgeRoot';

export default BadgeRoot;
