'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import type { Content } from '@radix-ui/react-alert-dialog';
import { useComponentConfig } from '../config-provider/context';
import AlertDialogUI from '../../components/alert-dialog/AlertDialogUI';
import type { AlertDialogProps } from '../../components/alert-dialog/types';

const AlertDialog = forwardRef<ComponentRef<typeof Content>, AlertDialogProps>((props, ref) => {
  const config = useComponentConfig('alertDialog');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <AlertDialogUI
      {...mergedProps}
      ref={ref}
    />
  );
});

AlertDialog.displayName = 'AlertDialog';

export default AlertDialog;
