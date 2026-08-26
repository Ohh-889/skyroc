import { forwardRef } from 'react';
import { cn } from '@skyroc/utils';
import { alertVariants } from './alert-variants';
import type { AlertRootProps } from './types';

const AlertRoot = forwardRef<HTMLDivElement, AlertRootProps>((props, ref) => {
  const { className, color, size, variant, ...rest } = props;

  const { root } = alertVariants({ color, size, variant });

  const mergedCls = cn(root(), className);

  return (
    <div
      className={mergedCls}
      data-slot="alert-root"
      role="alert"
      {...rest}
      ref={ref}
    />
  );
});

AlertRoot.displayName = 'AlertRoot';

export default AlertRoot;
