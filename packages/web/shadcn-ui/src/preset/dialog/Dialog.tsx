'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import type { Content } from '@radix-ui/react-dialog';
import { useComponentConfig } from '../config-provider/context';
import DialogUI from '../../components/dialog/DialogUI';
import type { DialogProps } from '../../components/dialog/types';

const Dialog = forwardRef<ComponentRef<typeof Content>, DialogProps>((props, ref) => {
  const config = useComponentConfig('dialog');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <DialogUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Dialog.displayName = 'Dialog';

export default Dialog;
