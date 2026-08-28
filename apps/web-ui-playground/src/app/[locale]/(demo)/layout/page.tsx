'use client';

import type { BreadcrumbItem, SelectProps, ThemeSize } from '@skyroc/web-ui';
import { Breadcrumb, Button, ButtonGroup, Layout, LayoutTrigger, Select } from '@skyroc/web-ui';
import { Component, Dock, Home } from 'lucide-react';
import { useState } from 'react';
import type { LayoutCollapsible, LayoutSide, LayoutVariant } from '@/components/layout/layout-variants';

const DemoLayout = () => {
  const sides: SelectProps['items'] = [
    {
      label: 'left',
      value: 'left'
    },
    {
      label: 'right',
      value: 'right'
    }
  ];

  const variants: SelectProps['items'] = [
    {
      label: 'sidebar',
      value: 'sidebar'
    },
    {
      label: 'inset',
      value: 'inset'
    },
    {
      label: 'floating',
      value: 'floating'
    }
  ];

  const sizes: SelectProps['items'] = [
    {
      label: 'xs',
      value: 'xs'
    },
    {
      label: 'sm',
      value: 'sm'
    },
    {
      label: 'md',
      value: 'md'
    },
    {
      label: 'lg',
      value: 'lg'
    },
    {
      label: 'xl',
      value: 'xl'
    },
    {
      label: '2xl',
      value: '2xl'
    }
  ];

  const collapsibles: SelectProps['items'] = [
    {
      label: 'icon',
      value: 'icon'
    },
    {
      label: 'offcanvas',
      value: 'offcanvas'
    }
  ];

  const [side, setSide] = useState<SelectProps['value']>('left');
  const [variant, setVariant] = useState<SelectProps['value']>('sidebar');
  const [collapsible, setCollapsible] = useState<SelectProps['value']>('icon');
  const [size, setSize] = useState<SelectProps['value']>('md');
  const breadcrumbItems: BreadcrumbItem[] = [
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
  return (
    <>
      <div className="flex-y-center justify-end gap-2">
        <ButtonGroup>
          <Button variant="pure">side</Button>

          <Select
            items={sides}
            value={side}
            triggerProps={{
              className: 'w-30 cursor-pointer',
              placeholder: 'Select side'
            }}
            onValueChange={setSide}
          />
        </ButtonGroup>

        <ButtonGroup>
          <Button variant="pure">variant</Button>

          <Select
            items={variants}
            value={variant}
            triggerProps={{
              className: 'w-30',
              placeholder: 'Select variant'
            }}
            onValueChange={setVariant}
          />
        </ButtonGroup>

        <ButtonGroup>
          <Button variant="pure">collapsible</Button>

          <Select
            items={collapsibles}
            value={collapsible}
            triggerProps={{
              className: 'w-30',
              placeholder: 'Select collapsible'
            }}
            onValueChange={setCollapsible}
          />
        </ButtonGroup>

        <ButtonGroup>
          <Button variant="pure">size</Button>

          <Select
            items={sizes}
            value={size}
            triggerProps={{
              className: 'w-30',
              placeholder: 'Select size'
            }}
            onValueChange={setSize}
          />
        </ButtonGroup>
      </div>

      <div className='border-border border-solid" h-120 w-full border'>
        <Layout
          defaultOpen
          collapsible={collapsible as LayoutCollapsible}
          side={side as LayoutSide}
          sidebar={<div className="group p-2">sidebar</div>}
          size={size as ThemeSize}
          variant={variant as LayoutVariant}
          footer={<div className="border-border border-t p-4">This is Footer</div>}
          header={
            <div className="flex w-full items-center gap-2 px-4">
              <LayoutTrigger size={size as ThemeSize} />
              <Breadcrumb items={breadcrumbItems} />
            </div>
          }
          tab={<div className="border-border border-b p-4">This is Tab</div>}
          ui={{
            header: 'h-12'
          }}
        >
          <div className="flex-1 p-4">This is Content</div>
        </Layout>
      </div>
    </>
  );
};

export default DemoLayout;
