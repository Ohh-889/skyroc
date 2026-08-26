import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Title } from '@radix-ui/react-alert-dialog';
import { cn } from '@skyroc/utils';
import { dialogVariants } from './alert-dialog-variants';
import type { AlertDialogTitleProps } from './types';

const AlertDialogTitle = forwardRef<ComponentRef<typeof Title>, AlertDialogTitleProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { title } = dialogVariants({ size });

  const mergedClass = cn(title(), className);
  return (
    <Title
      className={mergedClass}
      data-slot="alert-dialog-title"
      {...rest}
      ref={ref}
    />
  );
});

AlertDialogTitle.displayName = 'AlertDialogTitle';

export default AlertDialogTitle;
