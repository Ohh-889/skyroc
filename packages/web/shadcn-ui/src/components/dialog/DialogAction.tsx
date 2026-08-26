import { forwardRef } from 'react';
import { Close } from '@radix-ui/react-dialog';
import { Button, type ButtonProps } from '../button';

const DialogAction = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <Close asChild>
      <Button
        data-slot="dialog-action"
        ref={ref}
        {...props}
      />
    </Close>
  );
});

DialogAction.displayName = 'DialogAction';

export default DialogAction;
