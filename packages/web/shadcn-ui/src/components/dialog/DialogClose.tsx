import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Close as _Close } from '@radix-ui/react-dialog';
import { cn } from '@skyroc/utils';
import { ButtonIcon } from '../button';
import { dialogVariants } from './dialog-variants';
import type { DialogCloseProps } from './types';

const DialogClose = forwardRef<ComponentRef<typeof _Close>, DialogCloseProps>((props, ref) => {
  const { children, className, component: Close = _Close, size, ...rest } = props;

  const { close } = dialogVariants({ size });

  const mergedClass = cn(close(), className);
  return (
    <Close
      {...rest}
      asChild
      className={children ? (className as string) : mergedClass}
      data-slot="dialog-close"
      ref={ref}
    >
      {children || (
        <ButtonIcon
          icon="lucide:x"
          size={size}
        />
      )}
    </Close>
  );
});

DialogClose.displayName = 'DialogClose';

export default DialogClose;
