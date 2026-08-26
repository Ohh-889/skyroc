'use client';

import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import PasswordUI from '../../components/password/PasswordUI';
import type { PasswordProps } from '../../components/password/types';

const Password = forwardRef<HTMLInputElement, PasswordProps>((props, ref) => {
  const config = useComponentConfig('password');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <PasswordUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Password.displayName = 'Password';

export default Password;
