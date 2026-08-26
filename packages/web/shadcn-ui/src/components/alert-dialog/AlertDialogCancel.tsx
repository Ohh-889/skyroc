import { forwardRef } from 'react';
import { Cancel } from '@radix-ui/react-alert-dialog';
import { Button, type ButtonProps } from '../button';

const AlertDialogCancel = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { variant = 'plain', ...rest } = props;

  return (
    <Cancel asChild>
      <Button
        data-slot="alert-dialog-cancel"
        ref={ref}
        variant={variant}
        {...rest}
      />
    </Cancel>
  );
});

AlertDialogCancel.displayName = 'AlertDialogCancel';

export default AlertDialogCancel;
