'use client';

import { Breadcrumb } from '@skyroc/web-ui';
import type { BreadcrumbItem } from '@skyroc/web-ui';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

const items: BreadcrumbItem[] = [
  {
    label: 'Alert',
    leading: <AlertCircle />,
    value: '/alert'
  },
  {
    label: 'Button',
    leading: <AlertCircle />,
    value: '/button'
  },
  {
    label: 'Card',
    leading: <AlertCircle />,
    value: '/card'
  },
  {
    label: 'divider',
    leading: <AlertCircle />,
    value: '/divider'
  }
];

const BreadcrumbCustomItem = () => {
  return (
    <Breadcrumb
      items={items}
      renderItem={item => <Link href={item.value}>{item.label}</Link>}
    />
  );
};

export default BreadcrumbCustomItem;
