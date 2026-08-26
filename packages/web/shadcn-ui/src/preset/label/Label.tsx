'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import type { Root } from '@radix-ui/react-label';
import { useComponentConfig } from '../config-provider/context';
import LabelUI from '../../components/label/LabelUI';
import type { LabelProps } from '../../components/label/types';

const Label = forwardRef<ComponentRef<typeof Root>, LabelProps>((props, ref) => {
  const config = useComponentConfig('label');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <LabelUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Label.displayName = 'Label';

export default Label;
