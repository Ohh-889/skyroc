'use client';

import { Breadcrumb } from '@skyroc/web-ui';
import type { BreadcrumbItem } from '@skyroc/web-ui';
import { Component, Dock, Home } from 'lucide-react';

const items: BreadcrumbItem[] = [
  {
    label: 'Home',
    leading: <Home />,
    value: 'home'
  },
  {
    label: 'Components',
    leading: <Component />,
    trailing: (
      <span className="rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline">
        New
      </span>
    ),
    value: 'components'
  },
  {
    label: 'Breadcrumb',
    leading: <Dock />,
    value: 'breadcrumb'
  },
  {
    label: 'Components2',
    leading: <Component />,
    value: 'components2'
  },
  {
    label: 'Breadcrumb2',
    leading: <Dock />,
    value: 'breadcrumb2'
  }
];

const BreadcrumbEllipsisDemo = () => {
  return (
    <Breadcrumb
      ellipsis
      // oxlint-disable-next-line no-console
      handleItemClick={item => console.log('Clicked:', item.value)}
      items={items}
    />
  );
};

export default BreadcrumbEllipsisDemo;
