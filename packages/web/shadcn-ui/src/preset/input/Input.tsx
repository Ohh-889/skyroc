'use client';

import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import InputUI from '../../components/input/InputUI';
import type { InputProps } from '../../components/input/types';

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const config = useComponentConfig('input');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <InputUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Input.displayName = 'Input';

export default Input;
