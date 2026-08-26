'use client';

import { useComponentConfig } from '../config-provider/context';
import LayoutUI from '../../components/layout/LayoutUI';
import type { LayoutProps } from '../../components/layout/types';

const Layout = (props: LayoutProps) => {
  const config = useComponentConfig('layout');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <LayoutUI
      {...mergedProps}
    />
  );
};

Layout.displayName = 'Layout';

export default Layout;
