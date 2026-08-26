'use client';

import { useComponentConfig } from '../config-provider/context';
import RadioUI from '../../components/radio/RadioUI';
import type { RadioProps } from '../../components/radio/types';

const Radio = (props: RadioProps) => {
  const config = useComponentConfig('radio');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <RadioUI
      {...mergedProps}
    />
  );
};

Radio.displayName = 'Radio';

export default Radio;
