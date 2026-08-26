'use client';

import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import NumberInputUI from '../../components/number-input/NumberInputUI';
import type { NumberInputProps } from '../../components/number-input/types';

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>((props, ref) => {
  const config = useComponentConfig('numberInput');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <NumberInputUI
      {...mergedProps}
      ref={ref}
    />
  );
});

NumberInput.displayName = 'NumberInput';

export default NumberInput;
