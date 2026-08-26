'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import InputOTPUI from '../../components/input-otp/InputOTPUI';
import type { InputOTPProps } from '../../components/input-otp/types';

const InputOTP = forwardRef<ComponentRef<typeof InputOTPUI>, InputOTPProps>((props, ref) => {
  const config = useComponentConfig('inputOtp');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <InputOTPUI
      {...mergedProps}
      ref={ref}
    />
  );
});

InputOTP.displayName = 'InputOTP';

export default InputOTP;
