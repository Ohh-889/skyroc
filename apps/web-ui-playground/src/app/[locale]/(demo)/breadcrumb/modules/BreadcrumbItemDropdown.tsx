'use client';

import { Breadcrumb, BreadcrumbLink, BreadcrumbPage, DropdownMenu } from '@skyroc/web-ui';
import type { BreadcrumbItem, DropdownMenuOptionProps } from '@skyroc/web-ui';
import { Component, Dock, Home } from 'lucide-react';

interface BreadcrumbItemWithDropdown extends BreadcrumbItem {
  items?: DropdownMenuOptionProps['item'][];
}

const dropdownItems: BreadcrumbItemWithDropdown[] = [
  {
    label: 'Home',
    leading: <Home />,
    value: 'home'
  },
  {
    label: 'Dropdown',
    value: 'dropdown',
    items: [{ label: 'Documentation' }, { label: 'Themes' }, { label: 'Github' }]
  },
  {
    label: 'Components',
    leading: <Component />,
    value: 'components'
  },
  {
    label: 'Breadcrumb',
    leading: <Dock />,
    value: 'breadcrumb'
  }
];

const BreadcrumbItemDropdown = () => {
  return (
    <Breadcrumb
      items={dropdownItems}
      renderItem={(item: BreadcrumbItemWithDropdown) => {
        if (item.items) {
          return (
            <DropdownMenu
              items={item.items}
              modal={false}
            >
              <BreadcrumbLink className="cursor-pointer">{item.label}</BreadcrumbLink>
            </DropdownMenu>
          );
        }

        return <BreadcrumbPage>{item.label}</BreadcrumbPage>;
      }}
    />
  );
};

export default BreadcrumbItemDropdown;
