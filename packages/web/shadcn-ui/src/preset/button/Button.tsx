'use client';

import { forwardRef } from 'react';
import { useComponentConfig } from '../config-provider/context';
import ButtonUI from '../../components/button/ButtonUI';
import type { ButtonProps } from '../../components/button/types';

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
