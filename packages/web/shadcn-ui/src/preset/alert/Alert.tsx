'use client';

import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import AlertUI from '../../components/alert/AlertUI';
import type { AlertProps } from '../../components/alert/types';

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  const config = useComponentConfig('alert');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <AlertUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Alert.displayName = 'Alert';

export default Alert;
