import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Description } from '@radix-ui/react-alert-dialog';
import { cn } from '@skyroc/utils';
import { dialogVariants } from './alert-dialog-variants';
import type { AlertDialogDescriptionProps } from './types';

const AlertDialogDescription = forwardRef<ComponentRef<typeof Description>, AlertDialogDescriptionProps>(
  (props, ref) => {
    const { className, size, ...rest } = props;

    const { description } = dialogVariants({ size });

    const mergedClass = cn(description(), className);
    return (
      <Description
        className={mergedClass}
        data-slot="alert-dialog-description"
        {...rest}
        ref={ref}
      />
    );
  }
);

AlertDialogDescription.displayName = 'AlertDialogDescription';

export default AlertDialogDescription;
