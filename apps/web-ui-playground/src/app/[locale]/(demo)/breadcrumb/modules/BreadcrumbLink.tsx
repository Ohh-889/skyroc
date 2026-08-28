'use client';

import { Breadcrumb } from '@skyroc/web-ui';
import type { BreadcrumbItem } from '@skyroc/web-ui';
import { Home } from 'lucide-react';

const items: BreadcrumbItem[] = [
  {
    label: 'Home',
    leading: <Home />,
    value: 'home'
  },
  {
    href: 'https://react.dev',
    label: 'React',
    target: '_blank',
    value: 'react'
  },
  {
    href: 'https://ui-play.skyroc.me',
    label: 'SkyrocUI',
    target: '_blank',
    value: '@skyroc/web-ui'
  }
];

const BreadcrumbLinkDemo = () => {
  return <Breadcrumb items={items} />;
};

export default BreadcrumbLinkDemo;
