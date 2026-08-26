import { forwardRef } from 'react';
import { Action } from '@radix-ui/react-alert-dialog';
import { Button, type ButtonProps } from '../button';

const AlertDialogAction = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <Action asChild>
      <Button
        data-slot="alert-dialog-action"
        ref={ref}
        {...props}
      />
    </Action>
  );
});

AlertDialogAction.displayName = 'AlertDialogAction';

export default AlertDialogAction;
