import { forwardRef } from 'react';
import { cn } from '@skyroc/utils';
import { dialogVariants } from './alert-dialog-variants';
import type { AlertDialogHeaderProps } from './types';

const AlertDialogHeader = forwardRef<HTMLDivElement, AlertDialogHeaderProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { header } = dialogVariants({ size });

  const mergedClass = cn(header(), className);
  return (
    <div
      className={mergedClass}
      data-slot="alert-dialog-header"
      {...rest}
      ref={ref}
    />
  );
});

AlertDialogHeader.displayName = 'AlertDialogHeader';

export default AlertDialogHeader;
