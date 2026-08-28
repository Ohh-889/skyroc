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
  }
];

const BreadcrumbCustomSeparator = () => {
  return (
    <Breadcrumb
      items={items}
      separator={<span className="text-sm text-gray-500">/</span>}
    />
  );
};

export default BreadcrumbCustomSeparator;
