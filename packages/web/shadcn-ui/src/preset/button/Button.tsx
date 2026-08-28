'use client';

import { forwardRef } from 'react';
import ButtonUI from '../../components/button/ButtonUI';
import type { ButtonProps } from '../../components/button/types';
import { useComponentConfig } from '../config-provider/context';

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const config = useComponentConfig('button');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <ButtonUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Button.displayName = 'Button';

export default Button;
