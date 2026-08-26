'use client';

import { useComponentConfig } from '../config-provider/context';
import IconUI from '../../components/icon/IconUI';
import type { IconProps } from '../../components/icon/types';

const Icon = (props: IconProps) => {
  const config = useComponentConfig('icon');

  const mergedProps = {
    ...config,
    ...props
  };

  return <IconUI {...mergedProps} />;
};

Icon.displayName = 'Icon';

export default Icon;
