import { forwardRef } from 'react';
import { cn } from '@skyroc/utils';
import { alertVariants } from './alert-variants';
import type { AlertDescriptionProps } from './types';

const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { description } = alertVariants({ size });

  const mergedCls = cn(description(), className);

  return (
    <div
      className={mergedCls}
      data-slot="alert-description"
      {...rest}
      ref={ref}
    />
  );
});

AlertDescription.displayName = 'AlertDescription';

export default AlertDescription;
