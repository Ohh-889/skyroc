import { forwardRef } from 'react';
import { cn } from '@skyroc/utils';
import { dialogVariants } from './alert-dialog-variants';
import type { AlertDialogFooterProps } from './types';

const AlertDialogFooter = forwardRef<HTMLDivElement, AlertDialogFooterProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { footer } = dialogVariants({ size });

  const mergedClass = cn(footer(), className);
  return (
    <div
      className={mergedClass}
      data-slot="alert-dialog-footer"
      {...rest}
      ref={ref}
    />
  );
});

AlertDialogFooter.displayName = 'AlertDialogFooter';

export default AlertDialogFooter;
