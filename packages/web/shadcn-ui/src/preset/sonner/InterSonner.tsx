'use client';

import type { ToasterProps } from 'sonner';
import { useComponentConfig } from '../config-provider/context';
import SonnerUI from '../../components/sonner/SonnerUI';

const Sonner = (props: ToasterProps) => {
  const config = useComponentConfig('sonner');

  const mergedProps = {
    ...config,
    ...props
  };

  return <SonnerUI {...mergedProps} />;
};

Sonner.displayName = 'Sonner';

export default Sonner;
