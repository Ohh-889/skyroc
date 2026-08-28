'use client';

import type { Root } from '@radix-ui/react-label';
import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import LabelUI from '../../components/label/LabelUI';
import type { LabelProps } from '../../components/label/types';
import { useComponentConfig } from '../config-provider/context';

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
