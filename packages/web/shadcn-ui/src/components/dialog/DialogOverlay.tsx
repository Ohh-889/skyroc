import { type ComponentRef, forwardRef } from 'react';
import { Overlay as _Overlay } from '@radix-ui/react-dialog';
import { cn } from '@skyroc/utils';
import { dialogVariants } from './dialog-variants';
import type { DialogOverlayProps } from './types';

const DialogOverlay = forwardRef<ComponentRef<typeof _Overlay>, DialogOverlayProps>((props, ref) => {
  const { className, component: Overlay = _Overlay, size, ...rest } = props;

  const { overlay } = dialogVariants({ size });

  const mergedClass = cn(overlay(), className);
  return (
    <Overlay
      {...rest}
      className={mergedClass}
      data-slot="dialog-overlay"
      ref={ref}
    />
  );
});

DialogOverlay.displayName = 'DialogOverlay';

export default DialogOverlay;
