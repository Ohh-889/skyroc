'use client';

import { forwardRef } from 'react';
import PasswordUI from '../../components/password/PasswordUI';
import type { PasswordProps } from '../../components/password/types';
import { useComponentConfig } from '../config-provider/context';

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
