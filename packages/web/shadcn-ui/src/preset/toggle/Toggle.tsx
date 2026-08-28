'use client';

import ToggleUI from '../../components/toggle/ToggleUI';
import type { ToggleProps } from '../../components/toggle/types';
import { useComponentConfig } from '../config-provider/context';

const Toggle = (props: ToggleProps) => {
  const config = useComponentConfig('toggle');

  const mergedProps = {
    ...config,
    ...props
  };

  return <ToggleUI {...mergedProps} />;
};

Toggle.displayName = 'Toggle';

export default Toggle;
