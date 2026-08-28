'use client';

import { Breadcrumb } from '@skyroc/web-ui';
import type { BreadcrumbItem, ThemeSize } from '@skyroc/web-ui';
import { Component, Dock, Home } from 'lucide-react';

const sizes: ThemeSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

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

const BreadcrumbSize = () => {
  return (
    <div className="flex flex-col gap-[12px]">
      {sizes.map(size => (
        <div
          className="flex items-center gap-4"
          key={size}
        >
          <span className="text-muted-foreground w-8 text-xs">{size}</span>

          <Breadcrumb
            items={items}
            size={size}
          />
        </div>
      ))}
    </div>
  );
};

export default BreadcrumbSize;
