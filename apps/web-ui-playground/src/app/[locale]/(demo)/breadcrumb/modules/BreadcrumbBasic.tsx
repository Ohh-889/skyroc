'use client';

import { Breadcrumb, toast } from '@skyroc/web-ui';
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

const BreadcrumbBasic = () => {
  function handleItemClick(item: BreadcrumbItem) {
    toast.success(`You clicked ${item.label}`, {
      classNames: {
        title: '!text-xs',
        toast: '!w-auto !px-2 !py-1.5'
      },
      position: 'top-center'
    });
  }

  return (
    <Breadcrumb
      handleItemClick={handleItemClick}
      items={items}
    />
  );
};

export default BreadcrumbBasic;
