'use client';

import RadioUI from '../../components/radio/RadioUI';
import type { RadioProps } from '../../components/radio/types';
import { useComponentConfig } from '../config-provider/context';

const Radio = (props: RadioProps) => {
  const config = useComponentConfig('radio');

  const mergedProps = {
    ...config,
    ...props
  };

  return <RadioUI {...mergedProps} />;
};

Radio.displayName = 'Radio';

export default Radio;
