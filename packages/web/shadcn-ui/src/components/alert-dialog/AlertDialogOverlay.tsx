import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Overlay } from '@radix-ui/react-alert-dialog';
import { cn } from '@skyroc/utils';
import { dialogVariants } from './alert-dialog-variants';
import type { AlertDialogOverlayProps } from './types';

const AlertDialogOverlay = forwardRef<ComponentRef<typeof Overlay>, AlertDialogOverlayProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { overlay } = dialogVariants({ size });

  const mergedClass = cn(overlay(), className);
  return (
    <Overlay
      className={mergedClass}
      data-slot="alert-dialog-overlay"
      {...rest}
      ref={ref}
    />
  );
});

AlertDialogOverlay.displayName = 'AlertDialogOverlay';

export default AlertDialogOverlay;
